const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const packageJson = require('../package.json')

const distDir = path.resolve(process.cwd(), process.env.SENTRY_DIST_DIR || 'dist')
const release = process.env.SENTRY_RELEASE || `${packageJson.name}@${packageJson.version}`
const dryRun = process.argv.includes('--dry-run')
const sentryBinary = process.platform === 'win32' ? 'sentry-cli.exe' : 'sentry-cli'

function runSentry(args) {
  if (dryRun) {
    console.log(`[dry-run] ${sentryBinary} ${args.join(' ')}`)
    return 0
  }

  const result = spawnSync(sentryBinary, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  return result.status || 0
}

if (!fs.existsSync(distDir)) {
  console.error(`dist directory not found: ${distDir}`)
  process.exit(1)
}

console.log(`Using Sentry release: ${release}`)
console.log(`Uploading sourcemaps from: ${distDir}`)

const releaseStatus = runSentry(['releases', 'new', release])

if (releaseStatus !== 0) {
  const infoStatus = runSentry(['releases', 'info', release])

  if (infoStatus !== 0) {
    process.exit(releaseStatus)
  }
}

const uploadStatus = runSentry([
  'sourcemaps',
  'upload',
  '--release',
  release,
  distDir,
  '--url-prefix',
  'app:///',
  '--ext',
  'js',
  '--ext',
  'map',
  '--validate',
  '--wait',
])

if (uploadStatus !== 0) {
  process.exit(uploadStatus)
}

const finalizeStatus = runSentry(['releases', 'finalize', release])

if (finalizeStatus !== 0) {
  process.exit(finalizeStatus)
}

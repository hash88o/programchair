#!/bin/sh
# ----------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements. See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership. The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License. You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied. See the License for the
# specific language governing permissions and limitations
# under the License.
# ----------------------------------------------------------------------------

# ----------------------------------------------------------------------------
# Apache Maven Wrapper startup batch script, version 3.3.2
# ----------------------------------------------------------------------------

set -euf
[ "${MVNW_VERBOSE-}" != debug ] || set -x

# Function to convert native paths for Windows compatibility
native_path() { printf %s\\n "$1"; }

# OS specific support for Windows
case "$(uname)" in
CYGWIN* | MINGW*)
  [ -z "${JAVA_HOME-}" ] || JAVA_HOME="$(cygpath --unix "$JAVA_HOME")"
  native_path() { cygpath --path --windows "$1"; }
  ;;
esac

# Set Java command paths
set_java_home() {
  if [ -n "${JAVA_HOME-}" ]; then
    if [ -x "$JAVA_HOME/jre/sh/java" ]; then
      JAVACMD="$JAVA_HOME/jre/sh/java"
      JAVACCMD="$JAVA_HOME/jre/sh/javac"
    else
      JAVACMD="$JAVA_HOME/bin/java"
      JAVACCMD="$JAVA_HOME/bin/javac"
      if [ ! -x "$JAVACMD" ] || [ ! -x "$JAVACCMD" ]; then
        echo "Error: JAVA_HOME is set to \"$JAVA_HOME\", but the necessary executables do not exist." >&2
        exit 1
      fi
    fi
  else
    JAVACMD="$(command -v java)" || :
    JAVACCMD="$(command -v javac)" || :
    if [ ! -x "${JAVACMD-}" ] || [ ! -x "${JAVACCMD-}" ]; then
      echo "Error: JAVA_HOME is not set and java/javac commands are not found in PATH." >&2
      exit 1
    fi
  fi
}

# Hash function to generate a unique identifier for the distribution URL
hash_string() {
  str="${1:-}" h=0
  while [ -n "$str" ]; do
    char="${str%"${str#?}"}"
    h=$(((h * 31 + $(LC_CTYPE=C printf %d "'$char")) % 4294967296))
    str="${str#?}"
  done
  printf %x\\n $h
}

# Function to print verbose messages if enabled
verbose() { :; }
[ "${MVNW_VERBOSE-}" != true ] || verbose() { printf %s\\n "${1-}"; }

# Function to handle errors
die() {
  printf %s\\n "$1" >&2
  exit 1
}

# Function to trim whitespace
trim() {
  printf "%s" "${1}" | tr -d '[:space:]'
}

# Load distribution properties from the maven-wrapper.properties file
while IFS="=" read -r key value; do
  case "${key-}" in
  distributionUrl) distributionUrl=$(trim "${value-}") ;;
  distributionSha256Sum) distributionSha256Sum=$(trim "${value-}") ;;
  esac
done <"${0%/*}/.mvn/wrapper/maven-wrapper.properties"

# Check if distributionUrl is set
[ -n "${distributionUrl-}" ] || die "Error: Cannot read distributionUrl property in ${0%/*}/.mvn/wrapper/maven-wrapper.properties"

# Determine the distribution platform
case "${distributionUrl##*/}" in
maven-mvnd-*bin.*)
  MVN_CMD=mvnd.sh _MVNW_REPO_PATTERN=/maven/mvnd/
  case "${PROCESSOR_ARCHITECTURE-}${PROCESSOR_ARCHITEW6432-}:$(uname -a)" in
  *AMD64:CYGWIN* | *AMD64:MINGW*) distributionPlatform=windows-amd64 ;;
  :Darwin*x86_64) distributionPlatform=darwin-amd64 ;;
  :Darwin*arm64) distributionPlatform=darwin-aarch64 ;;
  :Linux*x86_64*) distributionPlatform=linux-amd64 ;;
  *)
    echo "Warning: Cannot detect native platform for mvnd on $(uname)-$(uname -m), using default linux-amd64." >&2
    distributionPlatform=linux-amd64
    ;;
  esac
  distributionUrl="${distributionUrl%-bin.*}-$distributionPlatform.zip"
  ;;
maven-mvnd-*) MVN_CMD=mvnd.sh _MVNW_REPO_PATTERN=/maven/mvnd/ ;;
*) MVN_CMD="mvn${0##*/mvnw}" _MVNW_REPO_PATTERN=/org/apache/maven/ ;;
esac

# Adjust distribution URL for custom repository
[ -z "${MVNW_REPOURL-}" ] || distributionUrl="$MVNW_REPOURL$_MVNW_REPO_PATTERN${distributionUrl#*"$_MVNW_REPO_PATTERN"}"

# Set up Maven home directory
distributionUrlName="${distributionUrl##*/}"
distributionUrlNameMain="${distributionUrlName%.*}"
distributionUrlNameMain="${distributionUrlNameMain%-bin}"
MAVEN_USER_HOME="${MAVEN_USER_HOME:-${HOME}/.m2}"
MAVEN_HOME="${MAVEN_USER_HOME}/wrapper/dists/${distributionUrlNameMain-}/$(hash_string "$distributionUrl")"

# Function to execute Maven
exec_maven() {
  unset MVNW_VERBOSE MVNW_USERNAME MVNW_PASSWORD MVNW_REPOURL || :
  exec "$MAVEN_HOME/bin/$MVN_CMD" "$@" || die "Error: Cannot execute $MAVEN_HOME/bin/$MVN_CMD"
}

# Check if Maven is already installed
if [ -d "$MAVEN_HOME" ]; then
  verbose "Found existing MAVEN_HOME at $MAVEN_HOME"
  exec_maven "$@"
fi

# Validate the distribution URL
case "${distributionUrl-}" in
*?-bin.zip | *?maven-mvnd-?*-?*.zip) ;;
*) die "Error: distributionUrl is not valid; it must match *-bin.zip or maven-mvnd-*.zip, found '${distributionUrl-}'" ;;
esac

# Prepare temporary directory for download
if TMP_DOWNLOAD_DIR="$(mktemp -d)" && [ -d "$TMP_DOWNLOAD_DIR" ]; then
  clean() { rm -rf -- "$TMP_DOWNLOAD_DIR"; }
  trap clean HUP INT TERM EXIT
else
  die "Error: Cannot create temporary directory"
fi

# Create the directory for Maven installation
mkdir -p -- "${MAVEN_HOME%/*}"

# Download and install Apache Maven
verbose "Couldn't find MAVEN_HOME, downloading and installing it ..."
verbose "Downloading from: $distributionUrl"
verbose "Downloading to: $TMP_DOWNLOAD_DIR/$distributionUrlName"

# Select download method based on available tools
if ! command -v unzip >/dev/null; then
  distributionUrl="${distributionUrl%.zip}.tar.gz"
  distributionUrlName="${distributionUrl##*/}"
fi

# Handle quiet mode for download commands
__MVNW_QUIET_WGET=--quiet __MVNW_QUIET_CURL=--silent __MVNW_QUIET_UNZIP=-q __MVNW_QUIET_TAR=''
[ "${MVNW_VERBOSE-}" != true ] || __MVNW_QUIET_WGET='' __MVNW_QUIET_CURL='' __MVNW_QUIET_UNZIP='' __MVNW_QUIET_TAR=v

# Normalize HTTP authentication
case "${MVNW_PASSWORD:+has-password}" in
'') MVNW_USERNAME='' MVNW_PASSWORD='' ;;
has-password) [ -n "${MVNW_USERNAME-}" ] || MVNW_USERNAME='' MVNW_PASSWORD='' ;;
esac

# Download Maven using available tools or Java fallback
if [ -z "${MVNW_USERNAME-}" ] && command -v wget >/dev/null; then
  verbose "Found wget ... using wget"
  wget ${__MVNW_QUIET_WGET:+"$__MVNW_QUIET_WGET"} "$distributionUrl" -O "$TMP_DOWNLOAD_DIR/$distributionUrlName" || die "Error: Download failed with wget"

elif [ -z "${MVNW_USERNAME-}" ] && command -v curl >/dev/null; then
  verbose "Found curl ... using curl"
  curl ${__MVNW_QUIET_CURL:+"$__MVNW_QUIET_CURL"} "$distributionUrl" -o "$TMP_DOWNLOAD_DIR/$distributionUrlName" || die "Error: Download failed with curl"

elif command -v java >/dev/null; then
  verbose "Using Java to download"
  java -Dfile.encoding=UTF-8 -cp "${0%/*}/maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperDownloader "$distributionUrl" "$TMP_DOWNLOAD_DIR/$distributionUrlName" || die "Error: Download failed with Java"
else
  die "Error: No download tool available; please install wget or curl"
fi

# Verify the downloaded distribution
if [ -n "${distributionSha256Sum-}" ]; then
  echo "Verifying download ..."
  if [ -f "$TMP_DOWNLOAD_DIR/$distributionUrlName" ]; then
    echo "$distributionSha256Sum  $TMP_DOWNLOAD_DIR/$distributionUrlName" | sha256sum -c - || die "Error: Downloaded file verification failed"
  fi
fi

# Unzip or untar the downloaded distribution
if [ "${distributionUrl##*.}" = "zip" ]; then
  verbose "Unzipping $TMP_DOWNLOAD_DIR/$distributionUrlName to $MAVEN_HOME"
  unzip ${__MVNW_QUIET_UNZIP:+"$__MVNW_QUIET_UNZIP"} "$TMP_DOWNLOAD_DIR/$distributionUrlName" -d "$MAVEN_HOME" || die "Error: Failed to unzip Maven distribution"
else
  verbose "Untarring $TMP_DOWNLOAD_DIR/$distributionUrlName to $MAVEN_HOME"
  tar ${__MVNW_QUIET_TAR:+"$__MVNW_QUIET_TAR"} -xzf "$TMP_DOWNLOAD_DIR/$distributionUrlName" -C "$MAVEN_HOME" || die "Error: Failed to untar Maven distribution"
fi

# Clean up temporary files
clean
verbose "Maven downloaded and installed in $MAVEN_HOME"

# Execute Maven with the provided arguments
exec_maven "$@"

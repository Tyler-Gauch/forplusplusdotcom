#!/usr/bin/env bash
set -e
IFS='|'

help_output () {
    echo "usage: amplify-push <--environment|-e <name>>"
    echo "  --environment  The name of the Amplify environment to use"
    exit 1
}

POSITIONAL=()
while [[ $# -gt 0 ]]
    do
    key="$1"
    case ${key} in
        -e|--environment)
        ENV=$2
        shift
        ;;
        -r|--region)
        REGION=$2
        shift
        ;;
        *)
        POSITIONAL+=("$1")
        shift
        ;;
    esac
done
set -- "${POSITIONAL[@]}"

# Check valid environment name
if [[ -z ${ENV} || "${ENV}" =~ [^a-zA-Z0-9\-]+ ]] ; then help_output ; fi

AWSCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"default\"\
}"
AMPLIFY="{\
\"envName\":\"${ENV}\"\
}"
PROVIDERS="{\
\"awscloudformation\":${AWSCONFIG}\
}"
CODEGEN="{\
\"generateCode\":false,\
\"generateDocs\":false\
}"

AUTHCONFIG="{\
\"googleClientId\":\"${GOOGLE_CLIENT_ID}\"\
}"

CATEGORIES="{\
\"auth\":$AUTHCONFIG\
}"

echo "# Start initializing Amplify environment: ${ENV}"
if [[ -z ${STACKINFO} ]];
then
    echo "# Initializing new Amplify environment: ${ENV} (amplify init)"
    amplify init --amplify ${AMPLIFY} --providers ${PROVIDERS} --codegen ${CODEGEN} --categories $CATEGORIES  --yes;
    echo "# Environment ${ENV} details:"
    amplify env get --name ${ENV}
else
    echo "# Importing Amplify environment: ${ENV} (amplify env add)"
    amplify env add --name ${ENV} --config "${STACKINFO}" --awsInfo ${AWSCONFIG} --categories $CATEGORIES  --yes;
    echo "# Initializing existing Amplify environment: ${ENV} (amplify init)"
    amplify init --amplify ${AMPLIFY} --providers ${PROVIDERS} --codegen ${CODEGEN} --categories $CATEGORIES --yes;
    echo "# Environment ${ENV} details:"
    amplify env get --name ${ENV}
fi
echo "# Done initializing Amplify environment: ${ENV}"
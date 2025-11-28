## To release
run in gitHub new tag

## To deploy
1. Base64 encode your local kubeconfig:
cat ~/.kube/config | base64 | pbcopy
This will copy the base64-encoded kubeconfig to your clipboard.
2. Add it as a GitHub Secret:
Go to your GitHub repository: https://github.com/sekretk/cv
Navigate to: Settings → Secrets and variables → Actions
Click "New repository secret"
Name: KUBE_CONFIG (exactly as shown in the workflow)
Value: Paste the base64-encoded string from step 1
Click "Add secret"


## Todo
* run theme
* add in result html lang switcher
* use mustaches for i18n
* integrate date in result html
* add pdf link in result html
* theme switch (light\black)
* Mobile version

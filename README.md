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


## List of requirements
* photo
* typescript checker
* pure native API, no framework
* use SCSS
* theme switch (light\black)
* Language switcher (ENG\RU)
* GitHub repo as the only source of truth with scheduled auto update
* Mobile version
* print version

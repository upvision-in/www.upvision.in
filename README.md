# Upvision


This is sample jekyll project for gh-page implementation. And optional Docker deployment steps.


## To deploy your project on docker


These instructions will get you a copy of the project up and running on docker for development and testing purposes.


### Prerequisites


What things you need to install

```
Docker & Ruby
```


## Deployment


**From your project directory run below command:**

```
sudo docker run --rm -v "$(pwd):/srv/jekyll" -p 4000:4000 suchak145/jekyll
```


**If above command doesn't work than follow these:**


1. Copy Dockerfile to your project directory


2. Execute below commands:

```
sudo docker build -t repo_name/image_name:tag .

*( if you are using file other than Dockerfile to build image then use below command:
		sudo docker build -f Dockerfile-jekyll -t repo_name/image_name:tag .
)
```
```
sudo docker run --name container_name --rm -v "$(pwd):/srv/jekyll" -p 4000:4000 repo_name/image_name:tag
```

## Author



<p align="center">
<img src="https://raw.githubusercontent.com/devbaraus/portfolio_web/master/static/logo.svg" alt="" width="128" style="margin: 0 auto;">
</p>

<p align="center">
    <a href="https://app.netlify.com/sites/devbaraus/deploys">
        <img title="Netlify Status" src="https://api.netlify.com/api/v1/badges/1f7e2e0c-d846-4e5a-bed6-efc2b28fd45f/deploy-status">
    </a>
</p>

> :goat: My personal website/portfolio!

## Table of contents

- [What is it](#what-is-it)
- [Technologies](#technologies)
- [Features](#features)
- [How does it work](#how-does-it-work)
- [Free](#free)

# What is it

I made this website so I could display my arsenal of projects and people like you could know what I am up to.

It displays my personal and professional projects, my blog on dev community and my repositories on github.

It will always be a work in progress, so a lot of things may change.

# Technologies

- NodeJS
- GitHub API
- Trello API
- Dev API
- [Front End](https://github.com/devbaraus/portfolio_web) (Another repo)

# Features

- List my social media links
- List some of my repositories
- List my posts on dev community
- List my professional and personal projects

# How does it work

I use the 3 different API's to create the whole content to my front end and I opted to not use any database (fact explained on front end repo).

All projects are get from the Trello API where I built all cards with it's content, including:

- Title
- Description
- Project url
- Cover
- Banner
- Carousel images
- Tags
  
All repositories are get from GitHub API and all post from Dev API, following the same trello idea.

All secret data are in ambient variables so I don't need to worry.

![Trello Card](https://res.cloudinary.com/dmzu6cgre/image/upload/v1598060458/portfolio/public/trello.com-portfolioTrello_zy1orl.png)

# Free

I build this API because I saw on a website a guy using Trello as a CMS so build it too :smile:

Feel free to fork this repository and build your own version, just remember to send your website link then.
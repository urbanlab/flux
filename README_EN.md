# 🚗 FLUX

![two people standing in front of a projector screen](medias/image.jpg)



> [🇫🇷 La version française de ce document est disponible ici](README.md).


This is a prototype of a mobile application that allows users to adjust their work arrival times to reduce traffic congestion and optimize their commuting time.
[Learn more](https://www.erasme.org/InterCitoyen).

## Table of Contents
- [🚗 FLUX](#-flux)
  - [Table of Contents](#table-of-contents)
  - [🗒 Prerequisites](#-prerequisites)
  - [🚀 Quick Start](#-quick-start)
  - [🚀 Quick start](#-quick-start-1)
  - [⚙️ Installation](#️-installation)
  - [Docker compose](#docker-compose)
    - [Manual installation](#manual-installation)
  - [🖋 Author's notes](#-authors-notes)
    - [Global description](#global-description)
      - [Overview](#overview)
      - [Physical architecture](#physical-architecture)
      - [Implementation and structure](#implementation-and-structure)
    - [User guide](#user-guide)
    - [In the event of a problem](#in-the-event-of-a-problem)
    - [Changing demo settings](#changing-demo-settings)
  - [Still to be done:](#still-to-be-done)


## 🗒 Prerequisites

**For manual installation:**
- [NodeJS](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

**For Docker installation:**
- [Docker](https://www.docker.com/)


## 🚀 Quick Start

Launch the server with Docker

`docker run -p 8000:8000 erasme/flux -d`

The main screen is accessible at

`http://localhost:8000/visu`

Tablet screens are accessible at the following addresses:
`http://localhost:8000/mobile/?profile=lyon7`,
`http://localhost:8000/mobile/?profile=tassin`
`http://localhost:8000/mobile/?profile=villeurbanne`


## 🚀 Quick start


Start the server with docker


`docker run -p 8000:8000 erasme/flux -d`


The main screen can be accessed at


http://localhost:8000/visu


Tablet screens can be accessed at 
`http://localhost:8000/mobile/?profile=lyon7`,
`http://localhost:8000/mobile/?profile=tassin`
`http://localhost:8000/mobile/?profile=villeurbanne`


## ⚙️ Installation

## Docker compose

```bash
docker-compose up
```

The main screen is accessible at

`http://localhost:8000/visu`


The tablet screens can be accessed at 
`http://localhost:8000/mobile/?profile=lyon7`,
`http://localhost:8000/mobile/?profile=tassin`
`http://localhost:8000/mobile/?profile=villeurbanne`


### Manual installation

```bash
npm install
node index.js
```

The main screen can be accessed at

`http://localhost:8000/visu`


The tablet screens can be accessed at 

`http://localhost:8000/mobile/?profile=lyon7`,
`http://localhost:8000/mobile/?profile=tassin`
`http://localhost:8000/mobile/?profile=villeurbanne`

## 🖋 Author's notes


### Global description


#### Overview
Program used by the **flux** prototype exhibited at the Urban Lab of the Lyon metropolis. The simulated scenario is as follows:
* A certain number of people (on the order of a thousand) need to get to work in a company.
* They tend to arrive at the same time, around 8:30 am. This creates congestion on the access road to the workplace.
* Thanks to a mobile application, staff can stagger their arrival times to suit their needs, reducing traffic congestion and optimizing everyone's travel time.



#### Physical architecture
For the demonstration, we divide the staff into three categories of homogeneous behavior. Each category is represented by a typical person, embodied by a visitor interacting with the model. The model consists of 2 elements:
* 3 tablets**, representing the final application for three user groups. The user has a timetable which he must respect, and enters the min and max times between which he can arrive at work. The application then suggests a time at which he can arrive, and tells him how long his journey will take via a chatbot-like interface.
* 1 screen**, representing traffic conditions over time. Users' journey times are displayed, as well as a histogram of traffic versus time and a 15min by 15min visualization of traffic conditions.

#### Implementation and structure
This is a web application built with a NodeJS server and two web pages (1 visual for the tablets and 1 for the screen). The devices communicate with each other via port 8000 of their Wifi network, using sockets technology.


* The server is coded on the root/index.js file in the root directory. Calculations are grouped into functions in *root/scripts/functions_backend.js*, and user data is loaded from the JSON *root/resources/profiles*.
* The global display page is located in *root/views/visu/index.html*, the display being generated using p5.js technology from *root/views/visu/sketch.js*.
* The display page for mobile devices is generated in *root/views/mobile/index.html*.

### User guide

**/Caution:** This demo has been created for Linux (Ubuntu 16.04) and Google Chrome. It is not guaranteed to work on other OS or browsers!


### In the event of a problem
* The page displayed by the computer is a static image*:
  * Reload the computer's web page (F5 key), then those of the tablets.
* The tablets do not load their web page and display an error*:
  * Check that the tablets and the computer-server are connected to the same Wifi network.

### Changing demo settings
To modify demo settings:
* User data: *root/resources/profiles* * General settings (times, steps, etc.)
* General parameters (schedules, time steps, etc.): *root/scripts/functions_backend.js*
* Display parameters (screen): *root/views/visu/sketch.js*
* Display parameters (tablets): *root/views/mobile/index.html*

## Still to be done:
* Make the traffic simulated on the road by moving ellipses correspond to "real" traffic.
* Add a system of credits, which you earn by benefiting the system and which you consume when you are a load for it.
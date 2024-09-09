<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/beakerandjake/save-to-pocket">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h2 align="center">save-to-pocket</h2>
  <p align="center">
    Serverless API to save items to <a href="https://getpocket.com">Pocket</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Serverless API which allows you to easily save items to Pocket from many different devices using a simple HTTP POST. My specific use case for creating this project was that I wanted a way to save items to Pocket without having to sign in to Pocket on my browser or download the Pocket app to my phone.

Once the application is deployed to AWS, you can save items by making HTTP POST requests to the deployed API. Helper scripts are included which allow you to save items from your command line.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Architecture -->

## Architecture

Under the hood it uses AWS SAM, API Gateway, DynamoDb, Lambda, Cloudformation and SSM Parameter Store. The API Gateway methods are protected via a Lambda authorizer which uses Basic HTTP Authentication to validate credentials against a DynamoDb table of users. If authorized, a Lambda will save the item to Pocket via the Pocket API.

The application is split between a frontend AWS SAM application for the API Gateway and related Lambdas, and two backend Cloudformation stacks for the DynamoDB database and SSM Parameter Store parameters. Organizing the stacks based on lifecycle separates the persistent resources like the database and configuration from the frequently changing ones like the API Gateway.

<div align="center">
    <img src="https://github.com/user-attachments/assets/cc94ecd0-824c-458c-886e-a45637cbcd03" />
</div>

### Built With

[![AWS][AWS]][AWS-url]
[![DynamoDb][DynamoDb]][DynamoDb-url]
[![Node][Node]][Node-url]
[![Bash][Bash]][Bash-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is a walkthrough to getting the application deployed to your AWS account. All scripts and commands in this project are for a Linux scripting environment.

### Prerequisites

You will need the following software installed on your machine:

- [aws-cli] v2 (Ensure that you configured the CLI with your IAM credentials)
- [aws-sam-cli][aws-sam-cli-url] 1.x (I prefer a local pip venv install rather than a system wide install)
- [node.js][Node-url] 20.x
- [jq][jq-url] 1.x

#### Create a Pocket API App

In order to save items to pocket you have to [create][pocket-dev-url] a new Pocket API App.

When creating your Pocket app:

- Only the _Add_ permission is required.
- Platform can be set to _Web_

Once your application is created, it will be given a _Consumer Key_. This key will be used later in the installation so have it handy, but kept secure (don't commit it to source control).

### Installation

1. Create a pocket application and note the _Consumer Key_ (see instructions)[#create_a_pocket_api_app]
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
  - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/github_username/repo_name/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=github_username/repo_name" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- []()
- []()
- []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[AWS]: https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white
[AWS-url]: https://aws.amazon.com/
[DynamoDb]: https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white
[DynamoDb-url]: https://aws.amazon.com/dynamodb/
[Node]: https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org
[Bash]: https://img.shields.io/badge/GNU%20Bash-4EAA25?style=for-the-badge&logo=GNU%20Bash&logoColor=white
[Bash-url]: https://www.gnu.org/software/bash/
[aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
[aws-sam-cli-url]: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
[jq-url]: https://github.com/jqlang/jq
[pocket-dev-url]: https://getpocket.com/developer/

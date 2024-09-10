<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/beakerandjake/save-to-pocket">
    <img src="https://github.com/user-attachments/assets/225a733b-cfdc-4077-b1f0-c7f6aeefe079" alt="Logo" width="80" height="80">
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
    <li><a href="#about-the-project">About The Project</a></li>
    <li>
      <a href="#architecture">Architecture</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#troubleshooting">Troubleshooting</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#cli-installation">CLI Installation</a></li>
        <li><a href="#adding-users">Adding Users</a></li>
      </ul>
    </li>
    <li>
      <a href="#local-development">Local Development</a>
      <ul>
        <li><a href="#deploying">Deploying</a></li>
        <li><a href="#testing">Testing</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">
    <img src="https://github.com/user-attachments/assets/a39ed676-0bd6-4035-9e53-10db6c33e047" alt="Project Screenshot" />
</div>

Serverless API which allows you to easily save items to Pocket from many different devices using a simple HTTP POST. My specific use case for creating this project was that I wanted a way to save items to Pocket without having to sign in to Pocket on my browser or download the Pocket app to my phone.

Once the application is deployed to AWS, you can save items by making HTTP POST requests to the deployed API. Helper scripts are included which allow you to save items from your command line.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Architecture -->

## Architecture

Under the hood it uses AWS SAM, API Gateway, DynamoDb, Lambda, Cloudformation and SSM Parameter Store. The API Gateway methods are protected via a Lambda authorizer which uses Basic HTTP Authentication to validate credentials against a DynamoDb table of users. If authorized, a Lambda will save the item to Pocket via the Pocket API.

The application is split between a frontend AWS SAM application for the API Gateway and related Lambdas, and two backend Cloudformation stacks for the DynamoDB database and SSM Parameter Store parameters. Organizing the stacks based on lifecycle separates the persistent resources like the database and configuration from the frequently changing ones like the API Gateway.

<div align="center">
    <img src="https://github.com/user-attachments/assets/cc94ecd0-824c-458c-886e-a45637cbcd03" alt="Architecture diagram" />
</div>

### Built With

[![AWS][AWS]][AWS-url]
[![DynamoDb][DynamoDb]][DynamoDb-url]
[![Node][Node]][Node-url]
[![Bash][Bash]][Bash-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is a walkthrough to getting the application deployed to your AWS account.

### Prerequisites

You will need the following software installed on your machine:

- [aws-cli] v2 (Ensure that you configured the CLI with your IAM credentials)
- [aws-sam-cli][aws-sam-cli-url] 1.x (I prefer a local pip venv install rather than a system wide install)
- [node.js][Node-url] 20.x
- [python][python-url] 3.x
- [jq][jq-url] 1.x

You will also need a Pocket account.

#### Create a Pocket API App

In order to save items to pocket you have to [create][pocket-dev-url] a new Pocket API App.

When creating your Pocket app:

- Only the _Add_ permission is required.
- Platform can be set to _Web_

Once your application is created, it will be given a _Consumer Key_. This key will be used later in the installation so have it handy, but kept secure (don't commit it to source control).

### Installation

All commands are meant for a Linux environment and should be executed against the root of the repository.

1. Create a pocket application and note the _Consumer Key_ ([see instructions](#create-a-pocket-api-app))
2. Clone the repo
   ```sh
   git clone https://github.com/beakerandjake/save-to-pocket.git
   ```
3. Activate venv for aws-sam-cli (Optional, only necessary if you installed through a venv)

   ```sh
   source .venv/bin/activate
   ```

4. Connect your Pocket account to the Pocket App you created in Step 1
   ```sh
   bin/pocket-auth.sh
   ```
   This command will perform the Oauth flow to connect your Pocket account to the App you made. You will be asked to open a URL in your web browser and sign into pocket. Once signed in the command will output a Pocket _Access Token_ which you will need in a later step (This token should be treated like a secret and not committed to source control).
5. Deploy the application to AWS
   ```sh
   bin/deploy.sh
   ```
   You will be asked several questions during this command:
   - `Pocket API Consumer Key:` - Input the _Consumer Key_ you generated during step 1
   - `Pocket API Access Token:` - Input the _Access Token_ you generated during step 5.
   - `Enter default user [user]:` - This will be a username you will use to authenticate with our API, enter a desired username or press enter for the default.
   - `Enter user password:` - Input the desired password for the user and confirm it.

Once the `deploy` script is finished you can view the stacks in Cloudformation. You should see three new stacks _save-to-pocket-db_, _save-to-pocket-config_, and _save-to-pocket-frontend_.

**NOTE**: When this API is deployed to AWS it uses On-Demand pricing, meaning you are charged per API Gateway invocation, Lambda invocation, and DynamoDB read request. The expected usage of the API will be extremely low since you only invoke it when you save an item to pocket. This amount of usage should fall within the free tier of AWS. _However, because the API is publicly deployed you should ensure that you monitor usage and billing on AWS to ensure that no malicious actor is spamming it with requests, since you will be charged._

### Troubleshooting

Depending on where the `deploy` script fails it could leave stacks in place. So before running again make sure to delete the stacks that were created, either manually or using the `delete` script:

```sh
bin/delete.sh
```

   <p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Once the API is deployed you can save items to Pocket by posting to the API. This means you can use any device that you can generate an HTTP post from. I personally interact with the API via command line scripts from my desktop and laptop as well as an iOS shortcut on my phone.

**NOTE**: Because basic HTTP Authentication is used, all calls to the API must be made via HTTPS. This point probably isn't even worth mentioning because API Gateway does does not support HTTP, only HTTPS.

To save an item you can run the `save-to-pocket` helper script. This script does a simple POST request to the API, and takes care of the Basic Authorization header. It looks for a config file located by default at `~/.save-to-pocket/config`.

### CLI Installation

A helper shell script to post to your API is included in this project. You can install this script to your machine by including it in your PATH. Personally, I installed it by copying it to `/usr/local/bin`

1.  Install the `save-to-pocket` script

    ```sh
    sudo cp bin/save-to-pocket.sh /usr/local/bin/save-to-pocket
    ```

2.  Create the config file for the `save-to-pocket` script

    ```sh
    mkdir -p ~/.save-to-pocket
    touch ~/.save-to-pocket/config
    ```

    The config file should have the following contents:

    ```ini
    url=https://YOUR_API_GATEWAY_URL/v1/items
    username=USERNAME_CREATED_DURING_DEPLOY
    password=PASSWORD_CREATED_DURING_DEPLOY
    ```

3.  Once you have added the `save-to-pocket` script to your path and created the config file you can run the following command to save items to pocket from your CLI.

    ```sh
    save-to-pocket <url>
    ```

    Example:

    ```sh
    save-to-pocket "https://en.wikipedia.org/wiki/Scheme_(programming_language)"
    ```

### Adding Users

If you post to the API from multiple devices, you could configure unique credentials per device. To add new credentials to the API you can use the helper script `add-user`. This script will insert a new row into the DynamoDB table which stores users and their hashed credentials.

Usage:

```sh
bin/add-user.sh <stack-name> <username>
```

Example:

Add a new user called 'laptop'

```sh
bin/add-user.sh save-to-pocket-db laptop
```

You will be asked to enter and then confirm the password. On success the user will be added to the DynamoDB table. You can verify this in the AWS management console. You can configure your new device to store the new credentials outlined in [CLI Installation](#cli-installation)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LOCAL DEVELOPMENT -->

## Local Development

To develop locally you will need all of the dependencies defined in the [prerequisites](#prerequisites) section.

The AWS SAM stack is defined in `template.yml`, the cloudformation stacks are defined in the `resources/` folder. The Lambda functions are defined in the `src/` folder.

The first step for local development is to install the npm packages, these are required for linting / formatting:

```sh
npm install
```

### Deploying

If you make modifications to the Lambda functions or to the SAM template you can test the deployment using the SAM CLI.

```sh
sam deploy
```

This will deploy any changes you have made to the Lambda functions.

### Testing

The project uses npm workspaces for organization. Each Lambda function inside of the `src` folder is a workspace and defines test commands to locally invoke the Lambda using the AWS SAM CLI.

The SAM CLI invokes the Lambda functions with environment variables defined in `local-env.json` as well as events defined in the `events/` folder.

#### Environment Variables

When the Lambda functions are invoked via the AWS SAM CLI, their environment variables are defined in the `local-env.json` file. You will need to update this file with the table name from your deployed _save-to-pocket-db_ stack.

```json
{
  "SaveItemFunction": {
    "POCKET_ACCESS_TOKEN_PARAM_NAME": "/save-to-pocket/access-token",
    "POCKET_CONSUMER_KEY_PARAM_NAME": "/save-to-pocket/consumer-key"
  },
  "AuthorizeFunction": {
    "DYNAMODB_TABLE_NAME": "enter-table-name-here"
  }
}
```

#### Authorize Lambda

To test the authorize lambda run the following command:

```sh
npm test -w authorize
```

This will use the SAM CLI to invoke the lambda with an event payload defined at `events/authorize.json`. The field of interest is:

```json
  "identitySource": ["Basic dXNlcm5hbWU6cGFzc3dvcmQ="],
```

It's value is a Basic Authorization header. The Lambda will return an authorized or unauthorized status depending on whether or not a user exists in the DynamoDB table which has matching credentials.

#### Save Item Lambda

To test the Save Item lambda run the following command:

```sh
npm test -w save-item
```

The save item Lambda's event is defined in `events/save-item.json`. The field of interest is:

```json
"body": "{\"url\":\"https://en.wikipedia.org/wiki/Dodo\"}",
```

Modify the value of the `url` property to whatever item you wish to save.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the GNU GPL-3.0 License. See `LICENSE.txt` for more information.

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
[python-url]: https://www.python.org/

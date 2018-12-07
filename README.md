# Santa-as-a-Service-workshop# Workshop - Santa as a Service

At the end of this lab, you should have an app that looks like this: 
// insert screenshot

This workshop is made using IBM Cloud for simplicity, though if you feel more comfortable with an other platform, an other Image Recognition service or if you want to run Node-RED on your machine, please do so! 

## Before you begin

To complete this workshop you will need:
- An IBM Cloud account
- A Node-Red instance
- A Visual Recognition service

**Creating your IBM Cloud account**

1. Sign up for an account at [cloud.ibm.com](https://cloud.ibm.com/registration)
2. Verify your account by clicking on the link in the email sent to you
3. Log in to your IBM Cloud account

**Creating a Node-RED app** 

1. Click on "Catalog" on the navigation bar
2. Search and select "Node-RED Starter" 
3. Give a unique name to your app (this is needed as the name will be used as a hostname)
4. (Optional) Select the region, domain name or add tags to your app
4. Click "Create"

**Provisioning the VR service**

1. Go back to the catalog
1. Search and select "Visual Recognition" 
2. Create the service

**Linking your Node-RED app and the VR service**

1. Go back to your Resource List by clicking on the hamburger menu at the top-left and selecting Resource List
2. Click on the name of the app you've previously created under the "Cloud Foundry Apps" entry
3. Click on "Connections" on the left-hand side
4. Click on "Create Connection"
5. Click "Connect" next to your VR service and then "Restage"

### Building the flow
// todo

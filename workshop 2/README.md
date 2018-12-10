# Serverless, Node-Red & Watson Visual Recognition

## Overview

In this version of the workshop, you will:

- Learn how to deploy a serverless function with IBM Cloud Functions (powered by openwhisk)
    - How to create an action
    - How to define parameters
    - Learn how to activate that function with a HTTP request

## Before you start...

You will need to follow all of the steps to create an IBM Cloud account, Visual recognition service, and Node-RED instance on the [README](../README.md) page of this repo.

## Workshop

Openwhisk can be deployed in myriad ways and locations, and it forms the backbone of the IBM Cloud serverless architecture, so what you learn here can be used in any number of places and services, not just the IBM Cloud.


### Creating our serverless function

1. [log in to your IBM Cloud account](https://cloud.ibm.com/login).
2. On successful login, you'll be taken to your IBM Cloud Dashboard. At the top right of the view, click "Create Resource"

![An image of the location of the "create resource" button on the IBM Cloud Dashboard](images/create-resource.png)

3. Scroll down (or filter in the search bar at the top of the page) until you find the "Functions" box like the one shown in the image:

![The IBM Cloud Functions box](images/functions-box.png)

4. Once you've found the Functions box, click it to be taken to the IBM Cloud Function dashboard. Click on the "Start Creating" button. This will take you to the "Create" page.

![The IBM Cloud Functions dashboard. The "start creating" button is highlighted](images/function-dashboard.png)

5. Once the "Create" page has loaded, click on "Create Action". The "action" is where any serverless code we write will be stored, along with any configuration parameters we provide.

![The "create action" that we need to click](images/create-action.png)

6. You'll now be presented with a configuration page for your new action. Give you action a name, and make sure the runtime that's selected is "Node.js 8". Then hit the "Create" button at the bottom right of the page.

![The "create action" that we need to click](images/create-action-page.png)

You'll then be taken through to the serverless code editor where we can tell our function what to do once it's been activated.

![The initial code for our serverless function on creation](images/serverless-code.png)

Congratulations! You've just create a serverless function 🎉 Now we have a place where we can execute some code with some kind of external trigger. In this case, we're going to set up an HTTP endpoint that we can post data to (an image) and have our serverless function process it.

### Configuring our HTTP endpoint

1. On the far left of our current view (the serverless function code page) there is a link called "Endpoints" (highlighted in green in the below image). Click it and you'll be taken to the endpoint configuration page.

![The endpoints tab](images/endpoints-link.png)

Once on the Endpoints page, you'll be presented with a series of check boxes.

2. Toggle "Enable as a Web Action" so that it's ticked. This will connect our serverless function to an HTTP endpoint that external users will be able to use to trigger our function. Click "Save" at the top right of our dialog.

3. Once we've enabled our web action, a new section will appear just beneath the toggle (highlighted with the green box) with details about our newly assigned HTTP endpoint (blurred, but location highlighted in the red box). This is the URL that we can use to trigger, and send data to, our serverless function.

![The endpoints tab](images/web-action-details.png)

4. Copy and paste that URL into your browser. You should see something like the following

![The endpoints tab](images/hello_world_function.png)

What you're seeing is the result of our serverless function being executed after having been triggered by the HTTP endpoint! Isn't that neat? So far, we're getting the _Hello, World_ code that our function was created with by Openwhisk. Before we work to replace that code with something a little more useful, we're first going to configure some query parameters to enable our action to talk to Watson Visual Recognition.

### Obtaining Visual Recognition Credentials

First things first, before we can assign some Visual Recognition credentials to our serverless function, we need to generate them!

If you don't have a Watson Visual Recognition service already provisioned in your IBM Cloud account, you can find the instructions on the [main README](../README.md) of this repository. Go there, provision your Watson Visual Recognition instance, then come back here.

1. In another tab, Head to your [IBM Cloud Dashboard](https://cloud.ibm.com).
2. Click on the "view all" button in the resource summary section of your dashboard (highlighted in green).

![An image of the resource selection dialog](images/resource-selection.png)

3. This will take you to your resources list for your IBM Cloud account. Expand the "Services" section and select the Watson Visual Recogntion instance you have already created. This will take you through to the dashboard for your Visual Recognition instance.

![The Visual Recognition instance management screen](images/visual-recognition-dashboard.png)

4. On this page there is an "API Key" field. Click the copy icon next to the field (highlighted in green) to copy your Visual Recognition API key to your clipboard.

![An image highlighting the copy icon for the API key on the Visual Recognition management screen](images/clipboard-copy-button.png).

### Creating a parameter for your serverless function

If we want our serverless function to have access to private, pre-defined values we can create "Parameters". These behave much in the same way that environment variables do in a normal server application, but instead of persisting in the environment of the application, they are instead passed to the serverless function as a parameter when it's executed.

1. Head back to your serverless function page. On the left hand of the display, click the "Parameters" link in the menu.

![The Visual Recognition instance management screen](images/parameters.png)

2. Once the view has loaded, you'll see a button to "Add Parameter" (highlighted in green). Click the button.

![The Visual Recognition instance management screen](images/add-parameter.png)

3. You'll now be presented with an input form to add parameters to your function. In the field for "Parameter name" add **WATSON_VISUAL_RECOGNITION_KEY** and in the input field for "Parameter value" paste the API key for your Watson Visual Recognition instance. 

**You must put the API key inside of double quotes**, so it should look something like `"<YOUR_WATSON_API_KEY>"`

![The Visual Recognition instance management screen](images/parameter-form.png)

4. Click the "Save" button at the top right of the dialog to save your paramters.

Now, whenever we activate our function, we have access to an API key that we can use to make a request to our Visual Recognition instance. 

### Creating the code for our function

Now that we have everything set up to support our serverless function, it's time to start putting it together!

The function we'll be writing will be in JavaScript, but some of our dependencies (the Watson SDKs) require compilation for the target system (our serverless function), so we'll need to write our code, and then upload it with it's pre-compiled dependencies as a .zip file.

Before we get to that, please follow [these instructions](https://console.bluemix.net/openwhisk/learn/cli) to install the IBM Cloud Openwhisk CLI tools. 

1. If you've not done so already, clone or download this repository to your system and then open up the path in your terminal.
2. Once in the root path of this repository, navigate to the "code" folder by running the command `cd workshop\ 2/code/`
3. In here, you should have a `package.json` file, a small `index.js` file and a `dependencies.zip` file. These are all of the files we'll need to author, upload and run our serverless function.
4. Open the index.js file in your favourite IDE (code editor). It should contain the following:

```javascript
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

function main(params) {

    // Snippet 1

}
```

5. The first bit of code we're going to add to our serverless function is some conditional expressions to check that we have everything we need to run. Copy and paste the following just after `// Snippet 1`:

```javascript
if(!params.WATSON_VISUAL_RECOGNITION_KEY){
        
        return {
            statusCode: 500,
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({ status : "err", message : `The parameter "WATSON_VISUAL_RECOGNITION_KEY" has not been set.` })
        };

    } else if(params.__ow_headers['content-type'] !== "application/json"){
   
        return {
            statusCode: 400,
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({ status : "err", message : `Invalid Content-Type headers. Got ${params.__ow_headers['content-type']}, expected "application/json"` })
        };
   
    } else if(params.__ow_method !== "post"){
   
        return {
            statusCode: 400,
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({ status : "err", message : `Invalid HTTP request verb. Got ${params.__ow_method}, expected POST` })
        };
   
    } else if(params.image){

        // Snippet 2

    }

}
```

Here, we're first checking that we have a Watson Visual Recognition key passed as a parameter (which we set in the previous group of instructions). If it's not present, we end the execution of the serverless funciton and return an object that will be converted to an HTTP response by IBM Cloud Functions.

Next, we check that we're receiving a JSON object in the body of any HTTP request. Our function is going to expect a Base-64 encoded image in the body of any HTTP requests it receives. If we don't have the right `Content-Type` header, we again terminate the function and return a message asking for a properly formatted HTTP header.

Finally, we check that we're receving a request with the appropriate HTTP verb (in this case, `POST`). If we have the wrong HTTP verb being used for the request, we again terminate the process, and ask for the correct HTTP verb.

Assuming all of these conditions are met, we're able to start thinking about how we want to handle the image being receieved.

6. First up, we're going to convert our Base-64 encoded image into a Node.js Buffer. If our HTTP request has been formatted correctly, our image will be passed on the `image` property of the `params` object that is passed to our `main()` function. Watson accepts file buffers as an upload type, and it's a very simple, quick conversion, so we'll do that first. Beneath `// Snippet 2` copy and paste the following:

```javascript
const imageBuffer = Buffer.from(params.image, 'base64');
// Snippet 3
```

7. Now that we have our image converted into a file format that Watson accepts, we're reayd to start putting that request together. Copy and paste the following just beneath `// Snippet 3`:

```javascript
const visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    iam_apikey: params.WATSON_VISUAL_RECOGNITION_KEY
});

var params = {
    images_file: imageBuffer
};

// Snippet 4
```

8. With `visualRecognition`, we now have an object we can use to communicate with our Visual Recognition service, so let's put that together. Our serverless function expects a `return` statement to signify the end of our codes execution, but our request to the Watson APIs are asyncronous, so we're going to return a `Promise` object with the Watson request wrapped inside. Just beneath `// Snippet 4` copy and paste the following:

```javaScript
return new Promise( (resolve, reject) => {

    visualRecognition.detectFaces(params, function(err, result) {
        if (err) {

            reject({
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(err)
            });

        } else {
            
            // Snippet 5

        }
    });

} );
```

9. After a short time, Watson should return to us information about every face that it could find in the image we passed to it. For this workshop, we're not interested in the gender or age details of each face, we only want to return the coordinates of each face so we can santa-fy them. So, we're going to map over the Watson results and only return the coordinates for each identified face. Copy and paste the following just beneath `// Snippet 5`:

```javascript
const faces = result.images[0].faces.map( face => {

    return face.face_location;

} );

resolve( {
    headers : {
        "Content-Type" : "application/json"
    },
    body : JSON.stringify( { faces } )
} );

```

10. That's it! We now have all the code we need for our serverless function. It's time to deploy it.

### Packaging and deploying our function as a .zip file

Because our serverless function has dependencies (the Watson SDKs) we need to package them up with our JavaScript and upload them to IBM Cloud.
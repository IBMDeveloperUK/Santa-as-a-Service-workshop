# Workshop 1 - Node-Red & Watson Visual Recognition

### Overview 

In this version of the workshop you will create an app using exclusiverly Node-Red consisting of: 
* A frontend flow with some Javascript, CSS and HTML
* A backend flow getting the picture taken from the frontend and sending it to Watson Visual Recognition

### Frontend flow

At it's core, Node-RED is an interface that's running on an HTTP enabled server, this means we can create HTTP endpoints - and Web applications with very little effort 🎉

1. In the nodes panel on the left-hand side of the Node-RED UI, search for the `template` node with one output and drag it onto the canvas three times.
  1. Double click on the first one, name it `JavaScript` and set `Set property` to `msg.payload.script`
  2. Double click on the second one, name it `Sylesheet` and set `Set property` to `msg.payload.style`
  3. Double click on the third one and name it `HTML`
  4. Link them in the following order: Javascript -> Stylesheet -> HTML
3. Back in the node panel, search for the `http` node and drag it onto the canvas - then connect the http node's output to the `Javascript` nodes input. Double-click on the node, give it the name of your choice and set the `URL` to /beard-me, this will be the endpoint used to access your application.
4. Search for one final node, the `http response` node, which is similar to _ but distinct from_ the http node we created in step 2. This node will only have one input. Drag it onto the canvas and then connect the `HTML` output node to the `http response`'s input node. This node's settings don't need to be changed as it's only here to send the response back to the requests the HTTP Input node received.
5. You should now have a flow that looks like the following:

// insert screenshot

Good start! If you access your Node-Red URL followed by `/beard-me` you'll now see a blank page, not very jolly! Let's add some code to that. 

6. Open the `Javascript` node and paste the following code. Make sure that you read through the code to make sure you understand what's happening! If you're not sure feel free to ask one of the mentors that can help you.
<details>
<summary>Click to see the Javascript</summary>
<p>

```javascript
(function () {

    'use strict';
    // Select the camera element in the DOM
    const camera = document.querySelector('node-red-camera');

    // Event that listens to an event when a picture is taken
    camera.addEventListener('imageavailable', function (data) {
        let img = '<img src="' + data.detail + '" alt="Image before the beard"/>'
        document.body.querySelector('#pic-before').innerHTML = img;
    });

    // Create a new WebSocket connection, we will use this to get the results back from Watson Visual Recogntion
    const WS = new WebSocket('wss://' + window.location.host + '/beard-me');
    WS.onopen = function (e) {
        console.log('WS OPEN:', e);
    };

    // Triggered when we receive a message through the WebSocket
    WS.onmessage = function (e) {
        // If the message contains data
        if (e.data) {
            const face_info = JSON.parse(e.data);
            face_info.images[0].faces.forEach(function (element) {
                // For each face, we store the position values
                var top = element.face_location.top;
                var left = element.face_location.left;
                var width = element.face_location.width;
                var height = element.face_location.height;
                // We create a HTML element containing a beard image
                var beard_elem = '<div class="beard" style="top: '+ (0.50 * height + (top+10)) +'px; left: '+ (left+10) +'px; width: '+ (width - 20) +'px; height: '+ height +'px;"></div>';
                // We add that element to the picture taken
                document.body.querySelector('#pic-before').innerHTML += beard_elem;
            });
        }
    };

    WS.onclose = function (e) {
        console.log('WS CLOSE:', e);
    };

    WS.onerror = function (e) {
        console.log('WS ERROR:', e);
    };

}());
```

</p>
</details>  


7. Now, we'll do the same with a bit of CSS, open the `Stylesheet` node and paste the following code
<details>
<summary>Click to see the CSS</summary>
<p>

```css
/* This is to fix the size of the picture on the page and avoid the beard to be misplaced based on the window size */
#pic-before {
    width: 640px !important;
    height: 480px !important;
    position: relative;
    overflow: hidden;
    flex: 0 0 640px;
}

/* Properties of the beard, you can change the beard image here if you want */
.beard {
  position: absolute;
  display: block;
  /*background-image: url(https://svgshare.com/i/9j4.svg);*/
  background-image: url(https://vignette.wikia.nocookie.net/clubpenguin/images/3/34/FuzzyWhiteBeard.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.beard img {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
```

</p>
</details>  


8. Almost there! Now we need to import both the Javascript and the CSS on our HTML page, to do so, open the HTML node and paste in the following code
<details>
<summary>Click to see the HTML</summary>
<p>

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Title of our page -->
  <title>Santa-as-a-Service</title>
  <!-- We import an external framework for style -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css">
  <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
  <!-- We also import our custom CSS from the previous node using the curly brackets annotation -->
  <style type="text/css">{{{payload.style}}}</style>
  <!-- Import of the webcomponents to insure compatibility accross most browsers -->
  <script src="https://unpkg.com/@webcomponents/custom-elements"></script>
  <script src="https://unpkg.com/@webcomponents/shadydom"></script>
  <script src="/web-components/camera"></script>
</head>

<body>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Santa-as-a-Service
      </h1>
      <p class="subtitle">
        Take a picture of yourself and wait for the magic to happen!
      </p>
    </div>
  </section>
  <section class="section">
    <div class="columns">
      <div class="column" id="upload">
        <node-red-camera data-nr-name="beard-picture" data-nr-type="still"></node-red-camera>
      </div>
      <div id="pic-before" style="height:480px; width:640px;">
        Before
      </div>
    </div>
  </section>

  <!-- Import of our custom Javascript -->
  <script>
    {{{payload.script}}}
  </script>
</body>

</html>
```

</p>
</details>  

Nicely done! This is it for the frontend... But what is our app without something happening in the backend? It must feel lonely. Let's fix that.

### Backend flow

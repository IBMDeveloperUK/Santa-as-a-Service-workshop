var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

function main(params) {

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

        const imageBuffer = Buffer.from(params.image, 'base64');

        const visualRecognition = new VisualRecognitionV3({
            version: '2018-03-19',
            iam_apikey: params.WATSON_VISUAL_RECOGNITION_KEY
        });

        var params = {
            images_file: imageBuffer
        };

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
                    
                    const faces = result.images[0].faces.map( face => {

                        return face.face_location;

                    } );

                    resolve( {
                        headers : {
                            "Content-Type" : "application/json"
                        },
                        body : JSON.stringify( { faces } )
                    } );

                }
            });

        } );

    }

}

exports.main = main;
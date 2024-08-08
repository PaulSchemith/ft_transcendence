let nbEpochs;
let startPoint;
let endPoint;
let modelName;


function set_parms()
{
    level = document.getElementById('niveau').value;
    if(level == '1' ){
        startPoint = 15;
        endPoint = 1085;
        modelName = "https://10.12.3.1:8002/api/game/easy/model.json";
    }

    if(level == '2' ){
        startPoint = 11;
        endPoint = 1089;
        modelName = "https://10.12.3.1:8002/api/game/medium/model.json";
    }

    if(level == '3' ){
        startPoint = 13;
        endPoint = 1084;
        modelName = "https://10.12.3.1:8002/api/game/hard/model.json";
    }


    nbEpochs = document.getElementById('nbEpochs').value;
    nbEpochs = parseInt(nbEpochs, 10)
}

let dataTrainpureData = [];

function normalize(value) {
    return (value / 700);
}

function denormalize(normalizedValue) {
    return (normalizedValue * 700 );
}

function getDataTrain(table){

    var dataInt = [];
    var data2d = [];
    var dataTrain = [];

    // remove the NaN and transform the data from Str to Int
    for(let i=0; i < table.length; i++){
        if(table[i] != "NaN" &&  table[i] != "NaN\r"){
            dataInt.push(parseInt(table[i]));
        }
    }

    // transform the data to 2d dimension
    for(let i=0; i < dataInt.length; i += 2){
        data2d.push([dataInt[i], dataInt[i+1]]);
    }
    //create feature and target
    let i = 0;
    while(i < data2d.length){

        var line = [[],[]];
        if(i<data2d.length && data2d[i][0] == endPoint){
            while(i < data2d.length && data2d[i][0] != startPoint){
                line[0].push(data2d[i][1]);
                i++;
            }
            if( data2d[i][0] == startPoint){
                while(i < data2d.length && data2d[i][0] != endPoint){
                    i++;
                }
            }

            while(i < data2d.length && data2d[i][0] != endPoint){
                i++;
            }

            if(i < data2d.length){
                line[1].push(data2d[i][1]);
                dataTrain.push(line);
            }
        }
        i++;
    }
    return(dataTrain);
}


function getFeatures(dataTrain){

    var X = [];
    for(let i=0; i < dataTrain.length; i++){
        X.push(dataTrain[i][0]);
    }

    //Xs = tf.tensor2d(X);
    return X;
}


function getTarget(dataTrain){

    var y = [];
    for(let i=0; i < dataTrain.length; i++){
        y.push(dataTrain[i][1]);
    }
    //ys = tf.tensor2d(y);

    return(y);
}


function modelInit(len) {

    //create model
    const model = tf.sequential();

    //create the hidden layer
    const h1 = tf.layers.dense({
        units : 64,
        inputShape: [len], //input
        activation: 'sigmoid'
    });
    model.add(h1);

    //create the hidden layer
    const h2 = tf.layers.dense({
        units : 32,
        activation: 'sigmoid'
    });

    model.add(h2);

    //output layer
    const output = tf.layers.dense({
        units : 1,
        activation: 'sigmoid'
    })
    model.add(output);

    return(model);
}

//loss function
function customLoss(yTrue, yPred) {
    // Calcul de la condition : erreur absolue supérieure à 0.1
    const loss = tf.abs(yTrue.sub(yPred));

    return loss;
}


async function train(X, y, model){
    //optimizer
    const sgdOpt = tf.train.sgd(0.05);

    //compile
    model.compile({
        optimizer : sgdOpt,
        loss : "meanSquaredError"
    })

    //config
    const config = {
        batchSize: 500,
        epochs: nbEpochs
    }

    Xs = tf.tensor2d(X);
    ys = tf.tensor2d(y);

    //train
    const response = await model.fit(Xs, ys, config);
    // console.log(response.history.loss);
}



function predict(Xtest, model){

    var Xstest = tf.tensor2d(Xtest);
    ypred = model.predictOnBatch(Xstest);

    return(ypred);
}


// Fonction pour diviser les données en ensembles d'entraînement et de test
function splitData(data, labels , trainFraction) {

    const trainSize = Math.floor(data.length * trainFraction);

    const Xtrain = data.slice(0, trainSize);
    const Xtest = data.slice(trainSize);

    const ytrain = labels.slice(0, trainSize);
    const ytest = labels.slice(trainSize);

    return {
        Xtrain,
        Xtest,
        ytrain,
        ytest
    };
}

function normalizeTab(tab)
{
    var normaTab = []

    for(let i=0; i<tab.length; i++){
        line = [];
        for (let j=0; j < tab[i].length; j++){
            line.push(normalize(tab[i][j]))
        }
        normaTab.push(line);
    }

    return normaTab;
}


document.getElementById('fileInput').addEventListener('change', function(event) {
    set_parms();
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async function(e) {
    // Utilisez la fonction split pour diviser le texte à chaque nouvelle ligne
    pureData = e.target.result.split('\n');
    var dataTrain = getDataTrain(pureData);
    // console.loge(dataTrain);
    var Xs = getFeatures(dataTrain);
    var ys = getTarget(dataTrain);


    var XsNorm = normalizeTab(Xs);
    var ysNorm = normalizeTab(ys);


    //split train and test
    const Data = splitData(XsNorm, ysNorm, 0.8);

    //init the model
    model = modelInit(XsNorm[0].length);

    //train
    await train(Data.Xtrain, Data.ytrain, model);

    //save the model
    await model.save(modelName);

    //reload the model
    const modelCharge = await tf.loadLayersModel(modelName);

    //predict test
    ypred = predict(Data.Xtest, modelCharge);


    //performance on datatest
    var perf = await calculPerf(ypred , Data.ytest);

    // console.log(perf);
    // console.log(Data.ytest.length);

    };

    reader.readAsText(file);
  });


async function calculPerf(ypred, ytest){

    var perf = 0;
    predArray = await ypred.data();
    for(let i=0; i < predArray.length; i++){
        if(Math.abs(predArray[i] - ytest[i]) > (40/700)){
            perf++;
        }
    }

    return(perf);
}
const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const authenticate = require('../authenticate'); 
const Promotions = require('../models/promotions'); 
const { application } = require('express');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    },(err) => next(err))
    .catch((err) => next(err)); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promotion created', promotion); 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err)); 
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err)); 
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err)); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('Post operation not supported on /promotions/' 
        + req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true }) 
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promoId) 
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err)); 
});

//PREVIOUS VERSION OF THE CODE 

// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next(); 
// })
// .get((req,res,next) => {
//     res.end('Will send all the promotions to you!'); 
// })
// .post((req,res,next) => {
//     res.end('Will add the promotion: ' + req.body.name + 
//         ' with details: ' + req.body.description); 
// })
// .put((req,res,next) => {
//     res.statusCode = 403; 
//     res.end('PUT operation not supported on /dishes'); 
// })
// .delete((req,res,next) => {
//     res.end('Deleting all the promotions!');  
// });

// const promoIdRouter = express.Router();

// promoIdRouter.use(bodyParser.json());

// promoRouter.use(promoIdRouter);

// promoIdRouter.route('/:promoId') 
// .get((req,res,next) => {
//     res.end('Will send details of the promotion: ' 
//         + req.params.promoId + ' to you!'); 
// })
// .post((req,res,next) => {
//     res.statusCode = 403; 
//     res.end('POST operation not supported on /dishes/'
//         + req.params.promoId); 
// })
// .put((req,res,next) => {
//     res.write('Updating the promotion: ' + req.params.promoId + '\n');
//     res.end('Will update the promotion: ' + req.body.name 
//         + ' with details: ' + req.body.description); 
// })
// .delete((req,res,next) => {
//     res.end('Deleting promotion: ' + req.params.promoId);  
// });

module.exports = promoRouter;
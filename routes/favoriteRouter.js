const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) =>{
    Favorites.findOne({user: req.user})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    console.log(req.body);
    Favorites.findOne({user: req.user})
    .then((favorite) => {
        if(favorite != null){
            req.body.forEach(element => {
                if(favorite.dishes.indexOf(element._id) == -1){
                    favorite.dishes.push(element._id);
                }
            });
            favorite.save()
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then( favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => nexr(err))    
            }, (err) => nexr(err))
        }
        else{
            Favorites.create({user: req.user})
            .then( favorite => {
                req.body.forEach(element => {
                    if(favorite.dishes.indexOf(element._id) == -1){
                        favorite.dishes.push(element._id);
                    }
                });
                favorite.save()
                .then(favorite => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then( favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, (err) => nexr(err))    
                }, (err) => nexr(err))
            }, (err) => next(err))
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({user: req.user})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)); 
});

favoriteRouter.route('/:dishId')
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user})
    .then((favorite) => {
        if(favorite != null){
            if(favorite.dishes.indexOf(req.params.dishId) == -1){
                favorite.dishes.push(req.params.dishId);
            }
            favorite.save()
            .then(favorite => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then( favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => nexr(err))    
            }, (err) => nexr(err))
        }
        else{
            Favorites.create({user: req.user})
            .then( favorite => {
                if(favorite.dishes.indexOf(req.params.dishId) == -1){
                    favorite.dishes.push(req.params.dishId);
                }
                favorite.save()
                .then(favorite => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then( favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, (err) => nexr(err))    
                }, (err) => nexr(err))
            }, (err) => next(err))
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user})
    .then(favorite => {
        favorite.dishes = favorite.dishes.filter( item => item != req.params.dishId);
        favorite.save()
        .then(favorite => {
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then( favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => nexr(err))    
        }, (err) => nexr(err))
    }, err => next(err))
    .catch(err => next(err));
});

module.exports = favoriteRouter;
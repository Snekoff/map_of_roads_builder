import assert from 'assert';
import * as chai from 'chai';

import {Edge} from "../src/graph/edge.js";



describe('Edge test', function () {

    let edge;

    beforeEach(function () {
        // testing only edge without other objects as map logic
        // so for testin purposes obj.isLoaded = true;
        let obj = {};
        obj.vertices = [0, 1];
        obj.name = "test";
        obj.id = -1;
        obj.protectionAmount = 0;
        obj.level = 0;
        obj.isLoaded = true;

        edge = new Edge(obj);
    })

    afterEach(function () {
        edge = null;
    })


    describe('save', function () {
        let savedObj;
        beforeEach(function () {
            savedObj = edge.save();
        })

        it('should return same object...check type', function () {
            assert.equal(edge.type, savedObj.type);
        });

        it('should return same object...check name', function () {
            assert.equal(edge.name, savedObj.name);
        });

        it('should return same object...check id', function () {
            assert.equal(edge.id, savedObj.id);
        });

        it('should return same object...check richness', function () {
            assert.equal(edge.length, savedObj.length);
        });

        it('should return same object...check type', function () {
            assert.equal(edge.vertices[0] === savedObj.vertices[0], edge.vertices[1] === savedObj.vertices[1]);
        });

        it('should return same object...check richness', function () {
            assert.equal(edge.protectionAmount, savedObj.protectionAmount);
        });

        it('should return same object...check type', function () {
            assert.equal(edge.level, savedObj.level);
        });

        it('should return same object...check richness', function () {
            assert.equal(edge.isForVisualisation, savedObj.isForVisualisation);
        });

        afterEach(function () {
            savedObj = null;
        })
    });

    describe('load', function () {
        let savedObj;
        beforeEach(function () {
            savedObj = edge.save();
            edge = null;
            edge = Edge.load(savedObj);
        })

        it('should return same object...check type', function () {
            assert.equal(edge.type, savedObj.type);
        });

        it('should return same object...check name', function () {
            assert.equal(edge.name, savedObj.name);
        });

        it('should return same object...check id', function () {
            assert.equal(edge.id, savedObj.id);
        });

        it('should return same object...check richness', function () {
            assert.equal(edge.length, savedObj.length);
        });

        it('should return same object...check type', function () {
            assert.equal(edge.vertices[0] === savedObj.vertices[0], edge.vertices[1] === savedObj.vertices[1]);
        });

        it('should return same object...check richness', function () {
            assert.equal(edge.protectionAmount, savedObj.protectionAmount);
        });

        it('should return same object...check type', function () {
            assert.equal(edge.level, savedObj.level);
        });

        it('should return same object...check richness', function () {
            assert.equal(edge.isForVisualisation, savedObj.isForVisualisation);
        });

        afterEach(function () {
            savedObj = null;
        })
    });


});

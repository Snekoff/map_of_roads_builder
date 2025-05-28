import assert from 'assert';
import * as chai from 'chai';

import {Vertice} from "../src/graph/vertice.js";



describe('Vertice test', function () {

    let vertice;

    beforeEach(function () {

        let obj = {};
        obj.x = 0;
        obj.y = 0;
        obj.name = "test";
        obj.type = 0; // city
        obj.id = -1;

        vertice = new Vertice(obj);
    })

    afterEach(function () {
        vertice = null;
    })


    describe('changeName', function () {

        it('should return new name after evolving in new type', function () {
            let oldName = vertice.name;
            vertice.changeName(vertice.type);
            assert.notEqual(vertice.name, oldName);
        });

        it('should return new name after evolving in new type which contains old part', function () {
            let oldName = vertice.name;
            vertice.changeName(vertice.type);
            chai.assert.isAbove(vertice.name.indexOf(oldName), -1);
        });


    });

    describe('levelUp', function () {
        let epoch = {};
        epoch.getCostToLevelUpByType = function () {
            return [1];
        }


        it('levelup should return higher level', function () {
            vertice.levelUp(epoch);
            assert.equal(vertice.level, 1);
        });

        it('levelup should return same level if max', function () {
            vertice.level = 5;
            vertice.levelUp(epoch);
            assert.equal(vertice.level, 5);
        });
    });

    describe('changeIncomeToAddInNextTurn', function () {

        it('type of income should be a number', function () {
            vertice.changeIncomeToAddInNextTurn(1);
            let income = vertice.incomeToAddInNextTurn;
            assert.equal(typeof income, "number");
        });
    });

    describe('getByVariableName', function () {

        it('should return string if there is no such variable', function () {
            assert.equal(typeof vertice.getVariableByName("example"), "string");
        });

        it('should return id when asked id', function () {
            assert.equal(vertice.getVariableByName("id"), vertice.id);
        });
    });

    describe('setReachIncome', function () {

        it('reachIncome should be number', function () {
            let randomNumber = 10;
            vertice.setReachIncome(randomNumber);
            assert.equal(typeof vertice.reachIncome, "number");
        });
    });

    describe('applyReachChange', function () {
        let vertOldReach;
        beforeEach(function () {

            let randomNumber = 10;
            vertice.setReachIncome(randomNumber);
            vertOldReach = vertice.reach;
            vertice.applyReachChange();
        });


        it('reach should have new value', function () {
            assert.notEqual(vertice.reach, vertOldReach);
        });

        it('reach should be above for positive randomBumber set in setReachIncome', function () {
            chai.assert.isAbove(vertice.reach, vertOldReach);
        });

        it('should reach change be reseted to 0', function () {
            assert.equal(vertice.reachChange, 0);
        });
    });

    describe('applyIncomeChange', function () {

        let vertOldRichness;
        beforeEach(function () {

            let randomNumber = 10;
            vertice.changeIncomeToAddInNextTurn(randomNumber);
            vertOldRichness = vertice.richness;
            let epoch = {};
            epoch.getCostToLevelUpByType = function () {return [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]}
            vertice.applyIncomeChange(epoch);
        });


        it('reach should have new value', function () {
            assert.notEqual(vertice.richness, vertOldRichness);
        });

        it('reach should be above for positive randomBumber set in setReachIncome', function () {
            chai.assert.isAbove(vertice.richness, vertOldRichness);
        });

        it('should reach change be reseted to 0', function () {
            assert.equal(vertice.incomeToAddInNextTurn, 0);
        });
    });

    describe('save', function () {
        let saved
        beforeEach(function () {
            saved = vertice.save();
        });

        afterEach(function () {
            saved = null;
        });

        it('saved vertice id should match vertice id', function () {
            assert.equal(saved.id, vertice.id);
        });

        it('saved vertice name should match vertice name', function () {
            assert.equal(saved.name, vertice.name);
        }); // and other variables should match

        it('saved vertice should have variable objType', function () {
            assert.equal(saved.hasOwnProperty("objType"), true);
        });

        it('saved vertice should have objType equal Vertice', function () {
            assert.equal(saved.objType, "Vertice");
        });
    });

    describe('load', function () {
        let saved;
        let loaded;

        beforeEach(function () {
            vertice.adjacentVerticesAndRoadLengthToThem.set("randomKey", "randomValue");
            saved = vertice.save();
            let json = JSON.parse(JSON.stringify(saved));
            loaded = Vertice.load(json);
        });

        afterEach(function () {
            saved = null;
            loaded = null;
        });

        it('loaded vertice id should match vertice id', function () {
            assert.equal(loaded.id, vertice.id);
        });

        it('loaded vertice name should match vertice name', function () {
            assert.equal(loaded.name, vertice.name);
        }); // and other variables should match

        it('loaded vertice shouldn`t have variable objType', function () {
            assert.equal(loaded.hasOwnProperty("objType"), false);
        });

        it('loaded vertice should have field adjacentVerticesAndRoadLengthToThem', function () {
            assert.equal(loaded.hasOwnProperty("adjacentVerticesAndRoadLengthToThem"), true);
        });

        it('loaded vertice field adjacentVerticesAndRoadLengthToThem should be a map', function () {
            assert.equal(loaded.adjacentVerticesAndRoadLengthToThem instanceof Map, true);
        });

        it('loaded vertice field adjacentVerticesAndRoadLengthToThem should be a map with values from original vertice', function () {
            assert.equal(loaded.adjacentVerticesAndRoadLengthToThem.get("randomKey"), "randomValue");
        });
    });


});

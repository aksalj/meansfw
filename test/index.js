/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : meansfw
 *  File : index.js
 *  Date : 11/8/15 10:38 AM
 *  Description :
 *
 */
'use strict';
var chai = require('chai');
var expect = chai.expect;

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function(done) {
            expect([1,2,3].indexOf(5)).to.be.equal(-1);
            expect([1,2,3].indexOf(0)).to.be.equal(-1);
            done();
        });
    });
});

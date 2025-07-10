import express from 'express';

console.log(`From console we see : ${process.argv}`);
const args = require('minimist')(process.argv.slice(2));
console.log(`Args cleneaded ${args.port}`)
const asyncHandler = require('express-async-handler');
const { body, valdiationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.index = asyncHandler(async (req, res) => {
    const testMessage = 'Successfully connected';
    res.json({testMessage});
})
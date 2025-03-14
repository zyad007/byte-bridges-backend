import { app } from '../index';
import { MilestoneStatus, ContractStatus, ContractType } from '../enum/Contracts';
import { createContractAPI, getContractAPI } from '../controllers/ContractsController';
import { addMilestoneAPI, changeMilestoneStatusAPI } from '../controllers/MilestonesController';
import { Request, Response, NextFunction } from 'express';
import { CreateContractType } from '../schemas/ContractCreate';
import { CreateMilestoneType } from '../schemas/MilestoneCreate';
import { ChangeMilestoneStatusType } from '../schemas/MilestoneChangeStatus';

// Mock Express request, response, and next function
const mockRequest = (params = {}, body = {}, query = {}) => {
    return {
        params,
        body,
        query
    } as Request;
};

const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext: NextFunction = jest.fn();

describe('Contract and Milestone Tests', () => {
    let contractId: number;
    let firstMilestoneId: number;
    let secondMilestoneId: number;
    let thirdMilestoneId: number;

    // Test 1: Create a new contract and 3 milestones
    test('Should create a contract and 3 milestones, verify first milestone is IN_PROGRESS', async () => {
        // Create a new contract
        const contractData: CreateContractType = {
            ownerName: 'Test Owner',
            ownerEmail: 'test@example.com',
            title: 'Test Contract',
            description: 'This is a test contract',
            type: 'FIXED', // Using string literal that matches enum value
            startDate: new Date(),
            total: 3000
        };

        const contractReq = mockRequest({}, contractData);
        const contractRes = mockResponse();

        await createContractAPI(contractReq, contractRes, mockNext);

        // Verify contract creation
        expect(contractRes.status).toHaveBeenCalledWith(201);
        expect(contractRes.json).toHaveBeenCalled();

        // Extract contract ID from the response
        const contractResponseData = (contractRes.json as jest.Mock).mock.calls[0][0].data;
        contractId = contractResponseData.id;

        // Create first milestone
        const milestone1Data: CreateMilestoneType = {
            title: 'Milestone 1',
            description: 'First milestone',
            amount: 1000
        };

        const milestone1Req = mockRequest({ id: contractId.toString() }, milestone1Data);
        const milestone1Res = mockResponse();

        await addMilestoneAPI(milestone1Req, milestone1Res, mockNext);

        // Verify milestone creation
        expect(milestone1Res.status).toHaveBeenCalledWith(201);
        expect(milestone1Res.json).toHaveBeenCalled();

        // Extract milestone ID from the response
        const milestone1ResponseData = (milestone1Res.json as jest.Mock).mock.calls[0][0].data;
        firstMilestoneId = milestone1ResponseData.milestones[0].id;

        // Create second milestone
        const milestone2Data: CreateMilestoneType = {
            title: 'Milestone 2',
            description: 'Second milestone',
            amount: 1000
        };

        const milestone2Req = mockRequest({ id: contractId.toString() }, milestone2Data);
        const milestone2Res = mockResponse();

        await addMilestoneAPI(milestone2Req, milestone2Res, mockNext);

        // Verify milestone creation
        expect(milestone2Res.status).toHaveBeenCalledWith(201);
        expect(milestone2Res.json).toHaveBeenCalled();

        // Extract milestone ID from the response
        const milestone2ResponseData = (milestone2Res.json as jest.Mock).mock.calls[0][0].data;
        secondMilestoneId = milestone2ResponseData.milestones[1].id;

        // Create third milestone
        const milestone3Data: CreateMilestoneType = {
            title: 'Milestone 3',
            description: 'Third milestone',
            amount: 1000
        };

        const milestone3Req = mockRequest({ id: contractId.toString() }, milestone3Data);
        const milestone3Res = mockResponse();

        await addMilestoneAPI(milestone3Req, milestone3Res, mockNext);

        // Verify milestone creation
        expect(milestone3Res.status).toHaveBeenCalledWith(201);
        expect(milestone3Res.json).toHaveBeenCalled();

        // Extract milestone ID from the response
        const milestone3ResponseData = (milestone3Res.json as jest.Mock).mock.calls[0][0].data;
        thirdMilestoneId = milestone3ResponseData.milestones[2].id;

        // Get contract to verify milestone statuses
        const contractDetailsReq = mockRequest({ id: contractId.toString() });
        const contractDetailsRes = mockResponse();

        await getContractAPI(contractDetailsReq, contractDetailsRes, mockNext);

        expect(contractDetailsRes.status).toHaveBeenCalledWith(200);
        expect(contractDetailsRes.json).toHaveBeenCalled();

        const contractDetails = (contractDetailsRes.json as jest.Mock).mock.calls[0][0].data;
        const milestones = contractDetails.milestones;

        expect(milestones.length).toBe(3);

        // Verify first milestone is IN_PROGRESS and others are PENDING
        expect(milestones[0].status).toBe(MilestoneStatus.IN_PROGRESS);
        expect(milestones[1].status).toBe(MilestoneStatus.PENDING);
        expect(milestones[2].status).toBe(MilestoneStatus.PENDING);
    });

    // Test 2: Mark first milestone as COMPLETED and verify contract updates
    test('Should mark first milestone as COMPLETED and verify contract paid amount and progress', async () => {
        // Mark first milestone as COMPLETED
        const statusUpdateData: ChangeMilestoneStatusType = {
            status: 'COMPLETED' as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
        };

        const updateReq = mockRequest(
            { id: contractId.toString(), milestoneId: firstMilestoneId.toString() },
            statusUpdateData
        );
        const updateRes = mockResponse();

        await changeMilestoneStatusAPI(updateReq, updateRes, mockNext);

        expect(updateRes.status).toHaveBeenCalledWith(200);
        expect(updateRes.json).toHaveBeenCalled();

        // Get contract to verify paid amount and progress
        const contractDetailsReq = mockRequest({ id: contractId.toString() });
        const contractDetailsRes = mockResponse();

        await getContractAPI(contractDetailsReq, contractDetailsRes, mockNext);

        expect(contractDetailsRes.status).toHaveBeenCalledWith(200);
        expect(contractDetailsRes.json).toHaveBeenCalled();

        const contract = (contractDetailsRes.json as jest.Mock).mock.calls[0][0].data;

        // Verify paid amount is updated (should be 1000)
        expect(contract.paid).toBe(1000);

        // Verify progress is updated (should be approximately 33%)
        expect(Math.round(contract.progress)).toBe(33);

        // Verify second milestone is now IN_PROGRESS
        const milestones = contract.milestones;
        expect(milestones[0].status).toBe(MilestoneStatus.COMPLETED);
        expect(milestones[1].status).toBe(MilestoneStatus.IN_PROGRESS);
        expect(milestones[2].status).toBe(MilestoneStatus.PENDING);
    });

    // Test 3: Add a new milestone and verify progress updates
    test('Should add a new milestone and verify progress updates to 25%', async () => {
        // Add a fourth milestone
        const milestone4Data: CreateMilestoneType = {
            title: 'Milestone 4',
            description: 'Fourth milestone',
            amount: 1000
        };

        const milestone4Req = mockRequest({ id: contractId.toString() }, milestone4Data);
        const milestone4Res = mockResponse();

        await addMilestoneAPI(milestone4Req, milestone4Res, mockNext);

        expect(milestone4Res.status).toHaveBeenCalledWith(201);
        expect(milestone4Res.json).toHaveBeenCalled();

        // Get contract to verify progress
        const contractDetailsReq = mockRequest({ id: contractId.toString() });
        const contractDetailsRes = mockResponse();

        await getContractAPI(contractDetailsReq, contractDetailsRes, mockNext);

        expect(contractDetailsRes.status).toHaveBeenCalledWith(200);
        expect(contractDetailsRes.json).toHaveBeenCalled();

        const contract = (contractDetailsRes.json as jest.Mock).mock.calls[0][0].data;

        // Verify progress is updated (should be approximately 25%)
        expect(Math.round(contract.progress)).toBe(25);

        // Verify milestone statuses
        const milestones = contract.milestones;
        expect(milestones.length).toBe(4);
        expect(milestones[0].status).toBe(MilestoneStatus.COMPLETED);
        expect(milestones[1].status).toBe(MilestoneStatus.IN_PROGRESS);
        expect(milestones[2].status).toBe(MilestoneStatus.PENDING);
        expect(milestones[3].status).toBe(MilestoneStatus.PENDING);
    });
});

import axios, { AxiosRequestConfig } from 'axios';
import { Request, Response, NextFunction } from 'express';

import config from "../config";
export interface RequestWithUser extends Request {
    user?: {
        userId: string;
        // Add other properties as needed
    };
}

class RequestForwarder {
    private readonly serviceUrls: { [key: string]: string };

    constructor() {
        this.serviceUrls = {
            'orders': config.ORDER_SERVICE_URL,
            'users': config.USER_SERVICE_URL
        };
    }

    private extractPhrase(inputString: string): string {
        const index1 = inputString.indexOf('/');
        const index2 = inputString.indexOf('?');

        if (index1 === -1 && index2 === -1) {
            return inputString;
        } else if (index1 === -1) {
            return inputString.slice(0, index2);
        } else if (index2 === -1) {
            return inputString.slice(0, index1);
        } else {
            return inputString.slice(0, Math.min(index1, index2));
        }
    }

    public forward(req: RequestWithUser, res: Response, next: NextFunction): void {
        const { method, originalUrl, headers, body } = req;
        const serviceUrl = this.serviceUrls[this.extractPhrase(originalUrl.substring(1, originalUrl.length))];

        if (!serviceUrl) {
            res.status(404).json({ message: 'Service not found' });
            return;
        }

        let headersUpdate: any = { ...headers };
        if (req.user !== undefined) {
            headersUpdate = {
                ...headers,
                'User-ID': req.user.userId
            };
        }

        const axiosConfig: AxiosRequestConfig = {
            method,
            url: `${serviceUrl}${originalUrl}`,
            headers: headersUpdate,
            data: body
        };

        axios(axiosConfig)
            .then(response => {
                res.status(response.status).json(response.data);
            })
            .catch(error => {
                res.status(error.response?.status || 500).json({ message: error.response?.data?.message || 'Internal Server Error' });
            });
    }
}

export default RequestForwarder;

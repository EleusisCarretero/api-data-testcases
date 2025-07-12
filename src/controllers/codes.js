export const statusCodes = {
    infoRequest: '', // 100
    reqSuccessfull: {
        ok:200,
        created:201,
        caching:203,
        noContent: 204
    },
    ReqRedirect: '', // 300
    clientError: {
        badReq:400,
        notFound:404
    },
    serverProblem: {
        internalError: 500
    }
}
export async function axiosRequestErrorHandler(callback){
    let res = {
        data: null,
        error: "",
    };
    try {
        const data = await callback();
        if(data){
            res['data'] = data;
            res['error'] = null;
        }
    } catch (error) {
        if(error.response){
            if(error.response.status === 401){
                res['error'] = "Can not authenticate, try to refresh page or re-login if necessary.";
                alert("Can not authenticate, try to refresh page or re-login if necessary.");
            }
            else{
                res['error'] = error.response.data['message'];
                alert(error.response.data['message']);
            }
        }
    }
    return res;
    
    /**
     * Example response: 
     *  {
     *      data: [
                {
                    "type": "total",
                    "count": 5
                },
                {
                    "type": "anonymous",
                    "count": 3
                },
                {
                    "type": "user",
                    "count": 2
                }
            ],
            error: null,
     *  }
     */
}
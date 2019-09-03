<?php

namespace App\Http\Middleware;

use Closure;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles
     * @param  int  $param_user_id
     * @return mixed
     */
    public function handle($request, Closure $next, $roles, $param_user_id = null)
    {

        $roles = explode("|", $roles);

        //allow user if current user is url param user
        if( $request->user()->user_id == $param_user_id ){
            return $next($request);
        }

        //allow user if current user has the corect role
        foreach($roles as $role){
            if( $request->user()->hasRole($role) ){
                return $next($request);
            }
        }

        //block everithing else
        return response()->json('You do not have permission to access this', 403);
    }
}

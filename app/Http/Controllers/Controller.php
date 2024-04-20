<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
     * @OA\Info(
     *      version="1.0.0",
     *      title="Tenders API Documentation",
     *      description="Tenders API Documentation",
     *      @OA\Contact(
     *          email="info@just.sd"
     *      ),
     *      @OA\License(
     *          name="Apache 2.0",
     *          url="http://www.apache.org/licenses/LICENSE-2.0.html"
     *      )
     * )
     * @OA\SecurityScheme(
     * type="http",
     * securityScheme="bearerAuth",
     * scheme="bearer",
     * bearerFormat="JWT"
     * )
     * @OA\Server(
     *      url=L5_SWAGGER_CONST_HOST,
     *      description="Tenders API Server"
     * )
     *
     * @OA\Tag(
     *     name="Tenders",
     *     description="API Endpoints of Tenders"
     * )
     */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}

<?php

namespace App\Http\Controllers\Api\V1\SpiritualGifts;

use App\Http\Controllers\Controller;
use App\Http\Requests\SpiritualGift\SpiritualGiftQueryRequest;
use App\Http\Resources\SpiritualGiftResource;
use App\Models\SpiritualGift;
use App\Services\SpiritualGiftService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SpiritualGiftController extends Controller
{
    public function __construct(
        protected SpiritualGiftService $giftService
    ) {}

    /**
     * Display a listing of spiritual gifts.
     * GET /api/spiritual-gifts
     */
    public function index(SpiritualGiftQueryRequest $request): AnonymousResourceCollection
    {
        $gifts = $this->giftService->getGifts($request->validated());

        return SpiritualGiftResource::collection($gifts);
    }

    /**
     * Display a specific spiritual gift by ID or Code.
     * GET /api/spiritual-gifts/{spiritualGift}
     */
    public function show(string $identifier): SpiritualGiftResource
    {
        $gift = $this->giftService->findGift($identifier);

        return new SpiritualGiftResource($gift);
    }
}

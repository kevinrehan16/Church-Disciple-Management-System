<?php

namespace Database\Seeders;

use App\Models\SpiritualGift;
use Illuminate\Database\Seeder;

class SpiritualGiftSeeder extends Seeder
{
    public function run(): void
    {
        $gifts = [
            // ==========================================
            // INSTRUCTIONAL / SPEAKING GIFTS
            // ==========================================
            [
                'name' => 'Apostleship',
                'code' => 'GIFT-APOSTLE',
                'category' => 'Instructional',
                'description' => 'The ability to pioneer new ministries, plant churches, and provide spiritual oversight across regions.',
                'scripture_references' => '1 Corinthians 12:28, Ephesians 4:11',
            ],
            [
                'name' => 'Prophecy',
                'code' => 'GIFT-PROPHECY',
                'category' => 'Instructional',
                'description' => 'The ability to proclaim God’s truth with conviction, bringing encouragement, edification, and conviction.',
                'scripture_references' => 'Romans 12:6, 1 Corinthians 12:10, Ephesians 4:11',
            ],
            [
                'name' => 'Evangelism',
                'code' => 'GIFT-EVANGELISM',
                'category' => 'Instructional',
                'description' => 'The ability to share the Gospel effectively with non-believers, leading them to salvation in Christ.',
                'scripture_references' => 'Ephesians 4:11',
            ],
            [
                'name' => 'Pastoring / Shepherding',
                'code' => 'GIFT-PASTORING',
                'category' => 'Instructional',
                'description' => 'The ability to nurture, guide, protect, and care for the spiritual growth of a group of believers.',
                'scripture_references' => 'Ephesians 4:11',
            ],
            [
                'name' => 'Teaching',
                'code' => 'GIFT-TEACHING',
                'category' => 'Instructional',
                'description' => 'The ability to clarify, explain, and apply biblical truth so that others understand and grow.',
                'scripture_references' => 'Romans 12:7, 1 Corinthians 12:28, Ephesians 4:11',
            ],
            [
                'name' => 'Exhortation',
                'code' => 'GIFT-EXHORTATION',
                'category' => 'Instructional',
                'description' => 'The ability to encourage, counsel, comfort, and motivate others toward spiritual maturity.',
                'scripture_references' => 'Romans 12:8',
            ],
            [
                'name' => 'Word of Wisdom',
                'code' => 'GIFT-WISDOM',
                'category' => 'Instructional',
                'description' => 'The ability to understand divine perspective and apply spiritual insights effectively to specific situations.',
                'scripture_references' => '1 Corinthians 12:8',
            ],
            [
                'name' => 'Word of Knowledge',
                'code' => 'GIFT-KNOWLEDGE',
                'category' => 'Instructional',
                'description' => 'The ability to grasp deep biblical truths and understand divine knowledge revealed by the Holy Spirit.',
                'scripture_references' => '1 Corinthians 12:8',
            ],

            // ==========================================
            // SERVING / PRACTICAL GIFTS
            // ==========================================
            [
                'name' => 'Leadership',
                'code' => 'GIFT-LEADERSHIP',
                'category' => 'Serving',
                'description' => 'The ability to set vision, direct goals, and motivate others to accomplish God’s work with care and diligence.',
                'scripture_references' => 'Romans 12:8',
            ],
            [
                'name' => 'Administration',
                'code' => 'GIFT-ADMINISTRATION',
                'category' => 'Serving',
                'description' => 'The ability to organize, manage, and coordinate details, plans, and resources efficiently for ministry.',
                'scripture_references' => '1 Corinthians 12:28',
            ],
            [
                'name' => 'Service / Helps',
                'code' => 'GIFT-SERVICE',
                'category' => 'Serving',
                'description' => 'The ability to identify practical needs and assist others joyfully behind the scenes to accomplish ministry.',
                'scripture_references' => 'Romans 12:7, 1 Corinthians 12:28',
            ],
            [
                'name' => 'Giving',
                'code' => 'GIFT-GIVING',
                'category' => 'Serving',
                'description' => 'The ability to contribute personal wealth and resources generously, joyfully, and sacrificially to God’s work.',
                'scripture_references' => 'Romans 12:8',
            ],
            [
                'name' => 'Mercy',
                'code' => 'GIFT-MERCY',
                'category' => 'Serving',
                'description' => 'The ability to feel deep empathy and express practical compassion toward those suffering or in need.',
                'scripture_references' => 'Romans 12:8',
            ],
            [
                'name' => 'Hospitality',
                'code' => 'GIFT-HOSPITALITY',
                'category' => 'Serving',
                'description' => 'The ability to open one’s home and heart warmly to welcome and care for guests, strangers, and believers.',
                'scripture_references' => '1 Peter 4:9-10',
            ],
            [
                'name' => 'Discernment of Spirits',
                'code' => 'GIFT-DISCERNMENT',
                'category' => 'Serving',
                'description' => 'The ability to distinguish between truth and error, divine promptings, and human or demonic influence.',
                'scripture_references' => '1 Corinthians 12:10',
            ],

            // ==========================================
            // SIGN / MANIFESTATION GIFTS
            // ==========================================
            [
                'name' => 'Faith',
                'code' => 'GIFT-FAITH',
                'category' => 'Sign',
                'description' => 'The ability to trust God with extraordinary confidence for supernatural outcomes and fulfillment of His promises.',
                'scripture_references' => '1 Corinthians 12:9',
            ],
            [
                'name' => 'Healing',
                'code' => 'GIFT-HEALING',
                'category' => 'Sign',
                'description' => 'The ability to serve as a channel for God’s miraculous healing power in physical, emotional, or spiritual restoration.',
                'scripture_references' => '1 Corinthians 12:9, 28',
            ],
            [
                'name' => 'Miracles',
                'code' => 'GIFT-MIRACLES',
                'category' => 'Sign',
                'description' => 'The ability to serve as an instrument through which God performs supernatural acts that defy natural laws.',
                'scripture_references' => '1 Corinthians 12:10, 28',
            ],
            [
                'name' => 'Tongues',
                'code' => 'GIFT-TONGUES',
                'category' => 'Sign',
                'description' => 'The ability to pray or speak in an unlearned heavenly or foreign language as inspired by the Holy Spirit.',
                'scripture_references' => '1 Corinthians 12:10, 28',
            ],
            [
                'name' => 'Interpretation of Tongues',
                'code' => 'GIFT-INTERPRETATION',
                'category' => 'Sign',
                'description' => 'The ability to translate a message spoken in tongues into the native language for the edification of the body.',
                'scripture_references' => '1 Corinthians 12:10, 30',
            ],
        ];

        foreach ($gifts as $gift) {
            SpiritualGift::updateOrCreate(
                ['code' => $gift['code']],
                array_merge($gift, ['is_active' => true])
            );
        }
    }
}

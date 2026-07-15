<?php


namespace App\Enums;

enum MemberStatus: string
{
    case Active = 'Active';
    case Inactive = 'Inactive';
    case Suspended = 'Suspended';
    case Pending = 'Pending';
}

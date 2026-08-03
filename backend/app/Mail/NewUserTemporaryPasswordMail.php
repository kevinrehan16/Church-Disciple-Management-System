<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewUserTemporaryPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $tempPassword;

    public function __construct($tempPassword)
    {
        $this->tempPassword = $tempPassword;
    }

    public function build()
    {
        return $this->subject('Your Temporary Password for CDMS')
            ->html('
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <h2>Welcome to CDMS!</h2>
                            <p>Your account has been created by the administrator.</p>
                            <p>Here is your temporary password to log in:</p>
                            <div style="background: #f4f4f4; padding: 15px; font-size: 20px; font-weight: bold; color: #2563eb; display: inline-block; border-radius: 4px;">
                                ' . $this->tempPassword . '
                            </div>
                            <p style="margin-top: 20px;">Please change your password immediately after logging in for security purposes.</p>
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="' . config('app.url') . '/login" style="background: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Login Now</a>
                            </div>
                            <p>Thanks,<br>CDMS Team</p>
                        </div>
                    ');
    }
}

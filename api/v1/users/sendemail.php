<?php
	if(count(get_included_files()) == 1){
		echo json_encode(array('status' => 'Bad Request'));
		return;
	};

	// include_once '../../config/config.php';
	// include_once '../../models/users.php';
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'EmailServiceNo-reply/src/Exception.php';
	require 'EmailServiceNo-reply/src/PHPMailer.php';
	require 'EmailServiceNo-reply/src/SMTP.php';

	$database = new Connection();
	$db = $database->connect();
	$user = new Users($db);
	$result = "";
	$email = "";
	if(isset($_SESSION['email'])){
		$user->email = $_SESSION['email'];
		$sendto = $_SESSION['email'];
		$result = $user->geturl($_SESSION['email']);
	}else{
		$user->email = $data['email'];
		$sendto = $data['email'];
		$result = $user->geturl($data['email']);
	}
	if($result == "0"){
		$msg['status'] = 'Already Verified';
		echo json_encode($msg);
	}elseif($result == "3"){
		$msg['status'] = 'Please make sure you have submited the right email address';
		echo json_encode($msg);
	}elseif(empty($result)){
		$msg['status'] = 'Server Error! Please try again';
		echo json_encode($msg);
	}else{
		$name = $user->name();
		$mail = new PHPMailer();
		$mail->isSMTP();
		$mail->Host = "mail.reserveontime.com";
		$mail->SMTPAuth = true;
		$mail->Username = "no-reply@reserveontime.com";
		$mail->Password = "";
		$mail->SMTPSecure = 'tls';
		$mail->Port = "587";
		$mail->setFrom('no-reply@reserveontime.com', 'ReserveOnTime');
		$mail->addReplyTo('no-reply@reserveontime.com', 'ReserveOnTime');
		$mail->addAddress($sendto, $name);
		$mail->Subject = "Verify your email address !";
		$mail->isHTML(true);
		$mail->Body = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
   <head>
      <meta charset="UTF-8">
      <meta content="width=device-width, initial-scale=1" name="viewport">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta content="telephone=no" name="format-detection">
      <title>New email</title>
      <!--[if (mso 16)]>
      <style type="text/css">     a {text-decoration: none;}     </style>
      <![endif]--> <!--[if gte mso 9]>
      <style>sup { font-size: 100% !important; }</style>
      <![endif]--> <!--[if gte mso 9]>
      <xml>
         <o:OfficeDocumentSettings>
            <o:AllowPNG></o:AllowPNG>
            <o:PixelsPerInch>96</o:PixelsPerInch>
         </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <style type="text/css">
         #outlook a {	padding:0;}.ExternalClass {	width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {	line-height:100%;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}td .es-button-border:hover a.es-button-1 {	background:#e7560d!important;	border-color:#e7560d!important;}td .es-button-border-2:hover {	background:#e7560d!important;	border-style:solid solid solid solid!important;	border-color:#42d159 #42d159 #42d159 #42d159!important;}@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; 
         line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { 
         text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, 
         .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } }
      </style>
   </head>
   <body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
      <div class="es-wrapper-color" style="background-color:#F6F6F6">
         <!--[if gte mso 9]>
         <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
         </v:background>
         <![endif]-->
         <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
            <tr style="border-collapse:collapse">
               <td valign="top" style="padding:0;Margin:0">
                  <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                     <tr style="border-collapse:collapse">
                        <td align="center" style="padding:0;Margin:0">
                           <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                              <tr style="border-collapse:collapse">
                                 <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                       <tr style="border-collapse:collapse">
                                          <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                             <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr style="border-collapse:collapse">
                                                   <td align="center" style="padding:0;Margin:0">
                                                      <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:20px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:30px;color:#333333">ReserveOnTime</p>
                                                   </td>
                                                </tr>
                                                <tr style="border-collapse:collapse">
                                                   <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-left:20px;padding-right:20px;font-size:0px">
                                                      <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:10% !important" width="10%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                                         <tr style="border-collapse:collapse">
                                                            <td style="padding:0;Margin:0;border-bottom-width:3px;border-bottom-style:solid;border-bottom-color:#F37435;background-image:none;height:1px;width:100%;margin:0px;background-position:initial initial;background-repeat:initial initial"></td>
                                                         </tr>
                                                      </table>
                                                   </td>
                                                </tr>
                                             </table>
                                          </td>
                                       </tr>
                                    </table>
                                 </td>
                              </tr>
                              <tr style="border-collapse:collapse">
                                 <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                       <tr style="border-collapse:collapse">
                                          <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                             <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                <tr style="border-collapse:collapse">
                                                   <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px">
                                                      <h4 style="Margin:0;line-height:120%;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;color:#F37435">VERIFY YOUR ACCOUNT</h4>
                                                   </td>
                                                </tr>
                                                <tr style="border-collapse:collapse">
                                                   <td class="es-m-txt-c" align="center" style="padding:0;Margin:0">
                                                      <h1 style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#333333">HELLO '.$name.'</h1>
                                                   </td>
                                                </tr>
                                                <tr style="border-collapse:collapse">
                                                   <td class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-top:10px;padding-left:40px;padding-right:40px">
                                                      <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333">You registered an account on ReserveOnTime, before being able to use your account you need to verify that this is your email address by clicking the button below.</p>
                                                   </td>
                                                </tr>
                                                <tr style="border-collapse:collapse">
                                                   <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:20px;padding-bottom:30px"><span class="es-button-border es-button-border-2" style="border-style:solid;border-color:#2CB543;background:#2CB543;border-width:0px;display:inline-block;border-radius:30px;width:auto;background-color:#F37435;border-top-left-radius:14px;border-top-right-radius:14px;border-bottom-right-radius:14px;border-bottom-left-radius:14px;background-position:initial initial;background-repeat:initial initial">
                                                      <a href="'.$result.'" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\';font-size:20px;color:#FFFFFF;border-style:solid;border-color:#F37435;border-width:15px 20px;display:inline-block;background:#31CB4B;border-radius:30px;font-weight:bold;font-style:normal;line-height:24px;width:auto;text-align:center;background-color:#F37435;border-top-left-radius:14px;border-top-right-radius:14px;border-bottom-right-radius:14px;border-bottom-left-radius:14px;background-position:initial initial;background-repeat:initial initial">VERIFY YOUR ACCOUNT</a></span>
                                                   </td>
                                                </tr>
                                             </table>
                                          </td>
                                       </tr>
                                    </table>
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>
      </div>
   </body>
</html>
';

		if($mail->send() == false){
		    $msg['status'] = 'Email Error ! '.$mail->ErrorInfo;
			echo json_encode($msg);
		}
		echo json_encode(array('link' => $result));
	}
?>

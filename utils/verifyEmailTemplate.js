const verifyEmailTemplate = options=> {
return `
    <div style="font-family:BogleWeb;color:#535c65">
        <table style="width:100%;margin:auto" role="presentation" width="700" height="620" cellpadding="0" cellspacing="0" border="0" align="center">
            <tbody>
                <tr>
                    <td>
                        <table  align="center" background="https://servion.com/wp-content/themes/servion/images/servtheme.png" valign="top" background: url('https://servion.com/wp-content/themes/servion/images/servtheme.png') center / cover no-repeat #fff;>
                            <tbody>
                                <tr style="height:100%">
                                    <td style="width:50px"></td>
                                    <td>
                                        <table style="width:100%">
                                            <tbody>
                                                <tr style="height:324px;width:100%">
                                                    <td style="background-color:#ffffff;padding-top:25px;padding-left:30px;padding-right:30px;border: solid #b2c9df 1px;"> 
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <p style="font-weight:bold;font-size:20px">Hi ${options.supplierName}</p>
                                                                        <p style="font-size:16px">Welcome to ServMart!</p>
                                                                        <p style="font-size:16px">
                                                                            Thanks for creating an account. It’s important that we know that we have the correct email for you, so please take a quick moment to verify your email address by clicking below. This link is specific to you and valid for 10 minutes.
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <tr style="height:49px">
                                                                    <td></td>
                                                                </tr>
                                                                <tr style="height:44px;width:490px">
                                                                    <td style="background-color:#007dc6;color:#ffffff;font-size:16px;height:49px;text-align:center">
                                                                        <div>
                                                                            <a href=${options.verificationLink} style="background-color:#007dc6;color:#ffffff;display:inline-block;font-size:16px;font-weight:bold;text-align:center;text-decoration:none;width:490px" target="_blank">Verify Email</a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr style="height:25px">
                                                                    <td></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr style="height:25px;width:100%">
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td style="width:75px"></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="font-size:12px">
                        <p>This email (including any attachments) is intended for the use of the individual or entity to which it is addressed and contains information that is confidential. If the reader of this email (including any attachments) is not the intended recipient, you are hereby notified that any dissemination, distribution or copying of the same is strictly prohibited. If you have received this email (including any attachments) in error, please delete and destroy both the reply and the original e-mail (including any attachments).                  <br>
                            This is automatically generated email. Please do not reply to this email.                                                            
                        </p>
                    </td>
                </tr>
                <tr style="height:20px">
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>`
}

module.exports = verifyEmailTemplate;
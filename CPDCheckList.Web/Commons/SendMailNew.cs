using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Web;
using static System.Collections.Specialized.BitVector32;
using System.Threading;
using CPDCheckList.Web.Areas.Lable.Data;
using System.Globalization;
using System.Text;
using CPDCheckList.Web.Areas.SMT.Entities;

namespace CPDCheckList.Web.Commons
{
    public class SendMailNew
    {
        public static string NewMail(string content)
        {
            string htmlString = $@"<!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional //EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
                                   <html xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office"">
                                   <head>
                                       <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"">
                                   
                                       <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                                       <meta name=""x-apple-disable-message-reformatting"">
                                   </head>
                                   
                                   <body class=""clean-body u_body"" style=""margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #535353;color: #000000"">
                                       <table id=""u_body"" style=""border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #535353;width:100%"" cellpadding=""0"" cellspacing=""0"">
                                           <tbody>
                                               <tr style=""vertical-align: top"">
                                                   <td style=""word-break: break-word;border-collapse: collapse !important;vertical-align: top"">
                                                       
                                                       <!-- Header -->
                                                       <div class=""u-row-container"" style=""padding: 0px;background-color: transparent"">
                                                           <div class=""u-row"" style=""margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"">
                                                               <div style=""border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"">
                                                                   <div class=""u-col u-col-100"" style=""max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"">
                                                                       <div style=""background-color: #232323;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"">
                                                                           <div class=""v-col-border"" style=""box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"">
                                                                               <table id=""u_content_heading_8"" style=""font-family:arial,helvetica,sans-serif;"" role=""presentation"" cellpadding=""0"" cellspacing=""0"" width=""100%"" border=""0"">
                                                                                   <tbody>
                                                                                       <tr>
                                                                                            <td class=""v-container-padding-padding"" style=""overflow-wrap:break-word;word-break:break-word;padding: 10px 10px 10px 10px;font-family:arial,helvetica,sans-serif;text-align: center;color: white;font-weight: bold;"" align=""left"">
                                                                                                <span>Special Data Management System</span>
                                                                                            </td>
                                                                                       </tr>
                                                                                   </tbody>
                                                                               </table>
                                                                           </div>
                                                                       </div>
                                                                   </div>
                                                               </div>
                                                           </div>
                                                       </div>
                                                       
                                                       <!-- Body -->
                                                       <div class=""u-row-container"" style=""padding: 0px;background-color: transparent"">
                                                           <div class=""u-row"" style=""margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"">
                                                               <div style=""border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"">
                                                                   <div id=""u_column_6"" class=""u-col u-col-100"" style=""max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"">
                                                                       <div style=""background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"">
                                                                           <div class=""v-col-border"" style=""box-sizing: border-box; height: 100%; padding: 0px;border-top: 30px solid #e8eae9;border-left: 57px solid #e8eae9;border-right: 57px solid #e8eae9;border-bottom: 30px solid #e8eae9;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"">
                                                                               <table id=""u_content_text_2"" style=""font-family:arial,helvetica,sans-serif;"" role=""presentation"" cellpadding=""0"" cellspacing=""0"" width=""100%"" border=""0"">
                                                                                   <tbody>
                                                                                       <tr>
                                                                                           <td class=""v-container-padding-padding"" style=""overflow-wrap:break-word;word-break:break-word;padding:20px 30px;font-family:arial,helvetica,sans-serif;"" align=""left"">
                                   
                                                                                               <div style=""font-size: 14px;line-height: 140%;text-align: justify;word-wrap: break-word;"">
                                                                                                   <!-- Content here -->
                                                                                                    {content}
                                                                                               </div>
                                   
                                                                                           </td>
                                                                                       </tr>
                                                                                   </tbody>
                                                                               </table>
                                                                           </div>
                                                                       </div>
                                                                   </div>
                                                               </div>
                                                           </div>
                                                       </div>

                                                       <!-- Footer -->
                                                        <div class=""u-row-container"" style=""padding: 0px;background-color: transparent"">
                                                            <div class=""u-row"" style=""margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"">
                                                                <div style=""border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"">
                                                                    <div class=""u-col u-col-100"" style=""max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"">
                                                                        <div style=""background-color: #232323;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"">
                                                                            <div class=""v-col-border"" style=""box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"">
                                                                                <table id=""u_content_heading_8"" style=""font-family:arial,helvetica,sans-serif;"" role=""presentation"" cellpadding=""0"" cellspacing=""0"" width=""100%"" border=""0"">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class=""v-container-padding-padding"" style=""overflow-wrap:break-word;word-break:break-word;padding: 10px 10px 10px 10px;font-family:arial,helvetica,sans-serif;text-align: right;font-size: 12px;color: white;display: flex;justify-content: space-between;"" align=""left"">
                                                                                                <span style=""float: left;"">MBD-AUTOMATION-IOT@mail.foxconn.com</span>

                                                                                                <span style=""float: right;"">Copyright © 2023. MBD Automation IOT.</span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                   </td>
                                               </tr>
                                           </tbody>
                                       </table>
                                   </body>
                                   </html>";

            return htmlString;
        }
        public static bool SendMail(string toEmail, string[] ccEmail, string subject, string body)
        {
            try
            {
                Sendmail md = new Sendmail
                {
                    MailTo = toEmail,
                    MailSubject = subject,                    
                    MailType = "html",
                    MailCC = string.Join(",", ccEmail),
                    MailContent = body
                };

                Thread thread = new Thread(() =>
                {
                    SendMail(md);
                });
                thread.Start();
                thread.IsBackground = true;

                return true;
            }
            catch
            {
                return false;
            }
        }
        public static bool SendMail(Sendmail result)
        {
            try
            {

                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                string inputJson = JsonConvert.SerializeObject(result);
                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, "https://10.220.130.117:8888/api/Service/SendMail");
                var content = new StringContent(inputJson, null, "application/json");
                request.Content = content;
                var response = client.SendAsync(request).Result;

                if (response.EnsureSuccessStatusCode().StatusCode == HttpStatusCode.OK)
                {
                    return true;
                }
            }
            catch
            {

            }
            return false;
        }
    }
    public class Sendmail
    {
        public string MailTo { get; set; }
        public string MailCC { get; set; }
        public string MailSubject { get; set; }
        public string MailContent { get; set; }
        public string MailType { get; set; }
    }
    public class LabelMail
    {
        public static string CreateChecklistEmail(string toEmail, LableDataFlow checklist)
        {
            try
            {
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We want to inform you that there is a new order creation request in the system that requires your attention.</br>" +
                                     $"</br>" +
                                     $"Created: {checklist.LableDataFlow_Status.UserCreate.UserCode} - {MailCommond.RemoveDiacritics(checklist.LableDataFlow_Status.UserCreate.UserFullName)}</br>" +
                                     $"Date: {checklist.DateTime}</br>" +
                                     $"Product: {checklist.ProductName}</br>" +
                                     $"Manufacturing Order (MO): {checklist.MO}</br>" +
                                     $"Print Count: {checklist.LablePrintNum}</br>" +
                                     $"</br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>.</br>";
                mailContent += "After logging in, please navigate to the 'Data Flow' section under 'Label,' where you will find the new request awaiting your action.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[cpeii-vn-te-me@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }

        public static string ConfirmEmail(string toEmail, LableDataFlow checklist)
        {
            try
            {
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We are pleased to inform you that your order creation request has been successfully approved.</br>" +
                                     $"</br>" +
                                     $"Created: {checklist.LableDataFlow_Status.UserCreate.UserCode} - {MailCommond.RemoveDiacritics(checklist.LableDataFlow_Status.UserCreate.UserFullName)}</br>" +
                                     $"Date: {checklist.DateTime}</br>" +
                                     $"Product: {checklist.ProductName}</br>" +
                                     $"Manufacturing Order (MO): {checklist.MO}</br>" +
                                     $"Print Count: {checklist.LablePrintNum}</br>" +
                                     $"</br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>. ";
                mailContent += "After logging in, please visit the 'Data Flow' section under 'Label,' where you will see the status update of your request.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[cpeii-vn-te-me@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }

        public static string RejectEmail(string toEmail, LableDataFlow checklist)
        {
            try
            {
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We regret to inform you that your order creation request has been declined.</br>" +
                                     $"</br>" +
                                     $"Created: {checklist.LableDataFlow_Status.UserCreate.UserCode} - {MailCommond.RemoveDiacritics(checklist.LableDataFlow_Status.UserCreate.UserFullName)}</br>" +
                                     $"Date: {checklist.DateTime}</br>" +
                                     $"Product: {checklist.ProductName}</br>" +
                                     $"Manufacturing Order (MO): {checklist.MO}</br>" +
                                     $"Print Count: {checklist.LablePrintNum}</br>" +
                                     $"</br>";
                mailContent += $"Reason for rejection: {checklist.LableDataFlow_Status.Note}</br></br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>. ";
                mailContent += "After logging in, please visit the 'Data Flow' section under 'Label,' where you will see the status update of your request.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[cpeii-vn-te-me@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }

    }

    public class SampleMail
    {
        public static string CreateChecklistEmail(string toEmail, LabelSample label)
        {
            try
            {
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We want to inform you that there is a new order creation request in the system that requires your attention.</br>" +
                                     $"</br>" +
                                     $"Created: {label.LabelSampleStatus.UserCreated.UserCode} - {MailCommond.RemoveDiacritics(label.LabelSampleStatus.UserCreated.UserFullName)}</br>" +
                                     $"Date: {label.CreatedDate}</br>" +
                                     $"Product: {label.ProductName}</br>" +
                                     $"MO: {label.MO}</br>" +
                                     $"</br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>.</br>";
                mailContent += "After logging in, please navigate to the 'Data Flow' section under 'Label,' where you will find the new request awaiting your action.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[cpeii-vn-te-me@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }

        public static string ConfirmEmail(string toEmail, LabelSample label)
        {
            try
            {
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We are pleased to inform you that your order creation request has been successfully approved.</br>" +
                                     $"</br>" +
                                     $"Created: {label.LabelSampleStatus.UserCreated.UserCode} - {MailCommond.RemoveDiacritics(label.LabelSampleStatus.UserCreated.UserFullName)}</br>" +
                                     $"Date: {label.CreatedDate}</br>" +
                                     $"Product: {label.ProductName}</br>" +
                                     $"MO: {label.MO}</br>" +
                                     $"</br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>. ";
                mailContent += "After logging in, please visit the 'Data Flow' section under 'Label,' where you will see the status update of your request.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[cpeii-vn-te-me@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }

        public static string RejectEmail(string toEmail, LabelSample label)
        {
            try
            {
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We regret to inform you that your order creation request has been declined.</br>" +
                                     $"</br>" +
                                     $"Created: {label.LabelSampleStatus.UserCreated.UserCode} - {MailCommond.RemoveDiacritics(label.LabelSampleStatus.UserCreated.UserFullName)}</br>" +
                                     $"Date: {label.CreatedDate}</br>" +
                                     $"Product: {label.ProductName}</br>" +
                                     $"MO: {label.MO}</br>" +
                                     $"</br>";
                mailContent += $"Reason for rejection: {label.LabelSampleStatus.Note}</br></br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>. ";
                mailContent += "After logging in, please visit the 'Data Flow' section under 'Label,' where you will see the status update of your request.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[cpeii-vn-te-me@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }

        
    }
    public class SmtMail
    {
        public static string CreatetEmail(string toEmail, UnusualMatReq_mt request)
        {
            try
            {
                var signStatus = request.UnusualMatReqStatus.ToList()[0];
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We want to inform you that there is a new order creation request in the system that requires your attention.</br>" +
                                     $"</br>" +
                                     $"Created: {signStatus.UserCreated.UserCode} - {MailCommond.RemoveDiacritics(signStatus.UserCreated.UserFullName)}</br>" +
                                     $"Date: {request.DateReq}</br>" +
                                     $"Model: {request.ModelName}</br>" +
                                     $"MO: {request.MO}</br>" +
                                     $"</br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>.</br>";
                mailContent += "After logging in, please visit the 'SMT' section under 'Nhu cầu liệu bất thường', where you will see the status update of your request.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[cpeii-vn-te-me@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }
        public static string ApproveMail(string toEmail, UnusualMatReq_mt request)
        {
            try
            {
                var signStatus = request.UnusualMatReqStatus.ToList()[0];
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We are pleased to inform you that your order creation request has been successfully approved.</br>" +
                                     $"</br>" +
                                     $"Created: {signStatus.UserCreated.UserCode} - {MailCommond.RemoveDiacritics(signStatus.UserCreated.UserFullName)}</br>" +
                                     $"Date: {request.DateReq}</br>" +
                                     $"Model: {request.ModelName}</br>" +
                                     $"MO: {request.MO}</br>" +
                                     $"</br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>. ";
                mailContent += "After logging in, please visit the 'SMT' section under 'Nhu cầu liệu bất thường', where you will see the status update of your request.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[you-nan.ruan@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }
        public static string RejectEmail(string toEmail, UnusualMatReq_mt request)
        {
            try
            {
                var signStatus = request.UnusualMatReqStatus.ToList()[0];
                string mailContent = $"Hello, {toEmail}</br>" +
                                     $"</br>" +
                                     $"We hope this email finds you well. We regret to inform you that your order creation request has been declined.</br>" +
                                     $"</br>" +
                                     $"Created: {signStatus.UserCreated.UserCode} - {MailCommond.RemoveDiacritics(signStatus.UserCreated.UserFullName)}</br>" +
                                     $"Date: {request.DateReq}</br>" +
                                     $"Model: {request.ModelName}</br>" +
                                     $"MO: {request.MO}</br>" +
                                     $"</br>";
                mailContent += $"Reason for rejection: {MailCommond.RemoveDiacritics(signStatus.UnsualMatReqSigns.FirstOrDefault(s => s.Status == "Rejected").Note)}</br></br>";
                mailContent += "You can access this request by logging into your account on the <a href=\"https://10.220.130.116:8888/\">Checklist System https://10.220.130.116:8888/</a>. ";
                mailContent += "After logging in, please visit the 'SMT' section under 'Nhu cầu liệu bất thường', where you will see the status update of your request.</br>";
                mailContent += "This is an automated email, so there is no need to respond. If you have any questions or need further assistance, please contact our support team at <a href=\"javascript:;\">[cpeii-vn-te-me@mail.foxconn.com]</a> or <a href=\"javascript:;\">[37145]</a>.</br>";
                mailContent += "</br>";
                mailContent += "Thank you and Best Regards!";

                return mailContent;
            }
            catch
            {
                return string.Empty;
            }
        }
    }

    public static class MailCommond
    {
        public static string RemoveDiacritics(string text)
        {
            string normalizedString = text.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new StringBuilder();

            foreach (char c in normalizedString)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    stringBuilder.Append(c);
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }

}
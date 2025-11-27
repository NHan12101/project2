<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StayHub | Xác thực email</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background: #fff;
            padding: 20px 0;
        }

        .main {
            background: #ffffff;
            margin: 0;
            max-width: 460px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #ffe1e1;
        }

        .header {
            padding: 16px 40px 0;
            text-align: center;
        }

        .body {
            padding: 0 40px 16px;
            text-align: center;
            color: #2d2d2d;
            line-height: 1.7;
        }

        .title {
            font-size: 47px;
            font-weight: 700;
            color: #ff0000;
            margin: 0;
            letter-spacing: 1px;
        }

        .text {
            margin-top: 8px;
            font-size: 16px;
            color: #7f1d1d;
        }

        .otp-container {
            margin: 20px 0;
        }

        .otp {
            display: inline-block;
            font-size: 42px;
            font-weight: 700;
            letter-spacing: 10px;
            color: #dc2626;
            background: #fff5f5;
            padding: 14px 24px;
            border: 2px dashed #fecaca;
            border-radius: 12px;
        }

        .footer {
            padding: 16px 32px;
            background: #fffbfb;
            border-top: 1px solid #fecaca;
            font-size: 13.8px;
            color: #7f1d1d;
            text-align: center;
            line-height: 1.6;
        }

        @media (max-width:600px) {

            .header,
            .body,
            .footer {
                padding: 20px 22px;
                font-size: 11.8px;
            }

            .otp {
                font-size: 36px !important;
                letter-spacing: 6px !important;
                padding: 20px !important;
            }

            .text {
                font-size: 15px;
                color: #7f1d1d;
            }
        }
    </style>

</head>

<body>
    <article class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td class="header">
                    <h1 class="title">StayHub</h1>
                </td>
            </tr>
            <tr>
                <td class="body">
                    <p class="text">Mã xác thực OTP của bạn là</p>

                    <div class="otp-container">
                        <div class="otp">{{ $otp }}</div>
                    </div>

                    <p class="text">
                        Mã này sẽ hết hạn sau <strong>5 phút</strong>.<br><br>
                        Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    &copy; {{ date('Y') }} StayHub. All rights reserved. <br>
                    Email được gửi tự động – vui lòng không trả lời email này.
                </td>
            </tr>
        </table>
    </article>
</body>

</html>
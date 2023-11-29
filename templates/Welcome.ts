export const WelcomeTemplate = function (name: string) {
    const currentYear = new Date().getFullYear();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Default styles */
          body {
            background-color: #000000;
            color: #ffffff;
          }
  
          /* Dark mode styles */
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #000000;
              color: #ffffff;
            }
            .container {
              background-color: #333333;
              border: 1px solid #dddddd;
            }
          }
  
          /* Light mode styles */
          @media (prefers-color-scheme: light) {
            .container {
              background-color: #ffffff;
              border: 1px solid #dddddd;
            }
          }
  
          /* Container styles */
          .container {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        <!-- Header image -->
        <img src="https://example.com/header-image.jpg" alt="Welcome Header" style="display: block; max-width: 100%; height: auto;">
  
        <!-- Main content -->
        <div class="container">
          <h1>Welcome to Our Website!</h1>
          <p>Dear ${name},</p>
          <p>Thank you for joining our community. We are thrilled to have you on board!</p>
          <p>Feel free to explore our website and discover all the exciting features we have to offer.</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,</p>
          <p>The [Your Company] Team</p>
        </div>
  
        <!-- Copyright notice -->
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999999;">
          &copy; ${currentYear} [Your Company]. All rights reserved.
        </div>
  
        <!-- JavaScript to dynamically set the current year -->
        <script>
          document.querySelector('[data-year]').textContent = new Date().getFullYear();
        </script>
      </body>
      </html>
    `;

    return html;
};

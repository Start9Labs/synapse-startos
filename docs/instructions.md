<h1>Welcome to Synapse!</h1>
<p>Synapse is your personal gateway to the <a href="https://matrix.org/" target="_blank">Matrix</a> federation. With
  it, you can communicate with anyone, anywhere, without restriction, without permission, independently, and in total,
  trustless privacy.</p>

<br />
<h2><u>Getting Started</u></h2>

<h3>Step 1: Set Your Server Address</h3>
<p>After installing Synapse, you will be presented with a critical task to <b>Set Server Address/URL</b>. This determines
  the "domain" part of all user IDs on your server (e.g. <code>@user:my.domain.com</code>).</p>
<ol>
  <li>You must first add a public domain to the Homeserver interface in your StartOS network settings.</li>
  <li>Run the <b>Set Server Address/URL</b> task and select from the available domains.</li>
</ol>
<p style="color: red;"><b>Warning:</b> Your server address is <b>permanent</b> and cannot be changed after the first
  start. Choose carefully.</p>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 2: Create Your Admin User</h3>
<p>After setting your server address, you will be presented with a critical task to <b>Create Admin User</b>. This
  task runs while the service is stopped.</p>
<ol>
  <li>Run the <b>Create Admin User</b> task.</li>
  <li>A random password will be generated and displayed. <b>Copy and save it immediately</b> &mdash; it will not be shown
    again.</li>
  <li>If you lose the password, you can reset it later using the <b>Reset Admin Password</b> action (requires the service
    to be running).</li>
</ol>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 3: Configure Your Server</h3>
<p>Use the <b>Config</b> action (available at any time) to adjust the following settings:</p>
<ul>
  <li>
    <b>Registration</b>: Allow public account creation. Disabled by default. It is recommended to keep this disabled
    and create accounts for others using the Admin Dashboard. If you do enable it, disable it again once the needed
    accounts are created.
  </li>
  <li>
    <b>Federation</b>: Allow communication with other Matrix servers. Disabled by default. When enabled, you can
    optionally restrict federation to a whitelist of specific server domains.
  </li>
  <li>
    <b>Max Upload Size</b>: The file size limit for uploads (default 50 MB).
  </li>
  <li>
    <b>SMTP</b>: Enable email notifications. Choose System SMTP (if configured on your server) or provide custom
    SMTP credentials.
  </li>
</ul>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 4: Create Accounts</h3>
<p>With registration disabled, the way to create accounts is through the Admin Dashboard.</p>
<ol>
  <li>Open the <b>Admin Dashboard</b> interface from the Synapse service page.</li>
  <li>Log in with the admin credentials from Step 2.</li>
  <li>In the "Users" tab, click "+ Create" to add new accounts.</li>
  <li>Choose a User-ID, display name, and password. It is recommended <i>not</i> to make regular users Server Administrators.</li>
</ol>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 5: Connect with a Client</h3>
<p>To use your Synapse server, you will need a Matrix client app. Popular options include:</p>
<ul>
  <li><a href="https://element.io" target="_blank" noreferrer>Element</a></li>
  <li><a href="https://schildi.chat" target="_blank" noreferrer>SchildiChat</a></li>
  <li><a href="https://fluffychat.im" target="_blank" noreferrer>FluffyChat</a></li>
</ul>
<p>When configuring your client, use the address you chose in Step 1 as your homeserver URL.</p>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h2><u>Actions</u></h2>

<h3>Get Access Token</h3>
<p>Use the <b>Get Access Token</b> action (requires the service to be running) to obtain a Matrix access token for
  any user by providing their username and password. This is useful for programmatic access or third-party
  integrations.</p>

<h3>Appservice Management</h3>
<p>Synapse supports Matrix bridges (appservices) for connecting to other messaging platforms. Three actions are
  available for managing them:</p>
<ul>
  <li><b>Register Appservice</b>: Register a new bridge. This is typically triggered automatically by bridge
    services.</li>
  <li><b>List Appservices</b>: View all registered bridges and their details.</li>
  <li><b>Delete Appservice</b>: Remove a registered bridge.</li>
</ul>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h2><u>Security</u></h2>

<h3>Cross-Signing</h3>
<p>Matrix uses end-to-end encryption with cross-signing, which lets you verify other users once and then have that
  verification carry across all your devices. Check your client's security settings to ensure cross-signing is set
  up. If it shows "not set up", follow the prompts to enable it.</p>

<h3>Encryption Key Backup</h3>
<p>Matrix encryption keys are stored on your devices and rotated frequently. If you log out of all client sessions, you
  will lose your keys and be unable to decrypt your message history. To prevent this:</p>
<ul>
  <li>
    <b>Automatic backup (recommended)</b>: In your client's security settings, set up <b>Secure Backup</b>. This
    encrypts your keys and stores them on your Synapse server. You will be given a Security Key or asked to create a
    Security Phrase &mdash; store it somewhere safe.
  </li>
  <li>
    <b>Manual export</b>: Most clients allow you to export your E2E room keys to a file. This only covers keys up to
    the time of export, so repeat it periodically.
  </li>
</ul>

<h3>Message History Backup</h3>
<p>Your encrypted message history is stored on your Synapse server. Use the StartOS backup feature to regularly back up
  the Synapse service, which includes all data, media, keys, and configuration.</p>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h2><u>Federation</u></h2>
<p>If federation is enabled, you can join rooms on other Matrix servers.</p>
<ol>
  <li>In your client, select <b>Explore Public Rooms</b>.</li>
  <li>Enter the room alias, including the server domain. For example: <code>#room-name:matrix.example.com</code>.</li>
  <li>Joining a room may take a while depending on its size. If it fails, try again.</li>
</ol>

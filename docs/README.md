<h1>Welcome To Synapse!</h1>
<p>Synapse is your personal gateway to the <a href="https://matrix.org/" target="_blank">Matrix</a> federation. With
  it, you can communicate with anyone, anywhere, without restriction, without permission, independently, and in total,
  trustless privacy.</p>
<p style="color: red;">Warning! Synapse is an incredibly powerful and complex piece of software. Please read these
  instructions carefully. If you
  find yourself in trouble, the best thing to do is stop clicking and contact support.</p>

<br />
<h2><u>Instructions</u></h2>

<h3>Step 1: Initial Config</h3>
<ol>
  <li>
    <b>Federation</b>: Enabling Federation allows you to discover and join rooms on other Tor-enabled servers and vice versa. If you want a totally private chat server, you should disable Federation. Either way, you will <i>not</i> be able to interact with rooms and people on clearnet servers, such as matrix.org.
  </li>
  <li>
    <b>Email Notifications</b>: If you wish to receive email notification from your Synapse server, you must provide your own SMTP credentials.
  </li>
  <li>
    <b>Advanced - Enable Registration</b>: If you enable registration, anyone will be able to create an account on your Synapse server. It is <i>highly</i> recommended that you disable registrations whenever possible. The only time we recommend turning it on is if you quickly want multiple people to create accounts on your server, then you should turn it back off.
  </li>
</ol>
<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 2: Creating Your First Account</h3>
<p>
  With registrations disabled, the only way to create an account on your Server is through the Admin Portal.
</p>
<ol>
  <li>In your Synapse dashboard, click "Launch UI"</li>
  <li>
    Log in with your Admin Username and Password (located in Properties). For "Homeserver URL", do <i>not</i> enter your Homeserver address. Instead, enter your Admin Portal URL. Hint: this is the URL currently showing in your browser URL bar, minus the path. e.g. https://exampleaddress.local or http://exampleaddress.onion.
  </li>
  <li>In the "Users" tab, you will notice the admin user already created.</li>
  <li>In the "Users" tab, click "+ Create"</li>
  <li>
    Choose a User-ID, Displayname, and Password for your account. Optionally enter an email address under the 3PIDs section. It is not recommended to make this user a Server Administrator, as it is best to limit admin access.
  </li>
</ol>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 3: Using Your Server</h3>
<p>In order to use your new Synapse server, you will need to select a client app. We recommend:
  <ul>
    <li><a href="https://element.io" target="_blank" noreferrer>Element</a></li>
    <li><a href="https://schildi.chat" target="_blank" noreferrer>SchildiChat</a></li>
  </ul>
  These instructions are written for Element, but they are identical for SchildiChat.
</p>
<ul>
  <li>
    <h4>Web</h4>
    <ol>
      <p><i>Note: Element Web is <b>not</b> mobile responsive, meaning it does not adapt well to smaller screen sizes.
          You should only use it from desktop/laptop browsers, not from your mobile device</i></p>
      <li>Visit <a href="https://app.element.io" target="_blank">https://app.element.io</a> <i>from a Tor-enabled
          browser</i> (Tor Browser or Firefox, but <b>not</b> Brave)</li>
      <li>Click <code>Sign In</code> or <code>Create Account</code>, depending on whether or not you have already
        created your account</li>
      <li>Beneath "Host Account On" (following Create Account), or "Homeserver" (following Sign In), click <code>Edit</code> and change "matrix.org" to
        <code>http://your_synapse_address_from_interfaces.onion</code></li>
      <li>Complete sign in or account creation</li>
    </ol>
  </li>
  <li>
    <h4>macOS</h4>
    <ol>
      <li>Configure your macOS device to run Tor following these <a
          href="https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/tor-mac">instructions</a></li>
      <li>Download Element for macOS</li>
      <li>Click <code>Sign In</code> or <code>Create Account</code>, depending on whether or not you have already
        created your account</li>
      <li>Beneath "Host Account On" (following Create Account), or "Homeserver" (following Sign In), click <code>Edit</code> and change "matrix.org" to
        <code>http://your_synapse_address_from_interfaces.onion</code></li>
      <li>Complete sign in or account creation</li>
    </ol>
  </li>
  <li>
    <h4>Linux</h4>
    <ol>
      <li>Configure your Linux device to run Tor following these <a
          href="https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/tor-linux">instructions</a></li>
      <li>Download Element for Linux</li>
      <li>Because Element app is not Tor-enabled by default, you must launch it from the command line using the
        following command: <code>element-desktop --proxy-server=socks5://127.0.0.1:9050</code></li>
      <li>Click <code>Sign In</code> or <code>Create Account</code>, depending on whether or not you have already
        created your account</li>
      <li>Beneath "Host Account On" (following Create Account), or "Homeserver" (following Sign In), click <code>Edit</code> and change "matrix.org" to
        <code>http://your_synapse_address_from_interfaces.onion</code></li>
      <li>Complete sign in or account creation</li>
    </ol>
  </li>
  <li>
    <h4>Windows</h4>
    <ol>
      <li>Configure your Windows device to run Tor following these <a
          href="https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/tor-windows">instructions</a></li>
      <li>Download Element for Windows</li>
      <li>Right click on Element app icon</li>
      <li>Click "Properties"</li>
      <li>On the "Shortcut" tab, add <code>--proxy-server=socks5://127.0.0.1:9050</code> to the end of the "Target"
        field. Please note, there must be a space between <code>...Element.exe</code> and <code>--proxy...</code>
      </li>
      <li>Click <code>Sign In</code> or <code>Create Account</code>, depending on whether or not you have already
        created your account</li>
      <li>Beneath "Host Account On" (following Create Account), or "Homeserver" (following Sign In), click <code>Edit</code> and change "matrix.org" to
        <code>http://your_synapse_address_from_interfaces.onion</code></li>
      <li>Complete sign in or account creation</li>
    </ol>
  </li>
  <li>
    <h4>Android</h4>
    <ol>
      <li>Configure your Android device to run Tor following these <a
          href="https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/tor-android">instructions</a></li>
      <li>Download Element for Android</li>
      <li>Add Element to the list of VPN apps inside Orbot</li>
      <li>In the Element app, you will be asked to "Select a Server."  Choose "Other," and enter <code>http://your_synapse_address_from_interfaces.onion</code></li>
      <li>Complete sign in or account creation.  If you are asked to 'Trust' a certificate, go ahead and do so.  This is safe to do as you are the server operator and traffic is already over Tor</li>
    </ol>
  </li>
  <li>
    <h4>iOS</h4>
    <ol>
      <li>Configure your iOS device to run Tor following these <a
          href="https://docs.start9.com/latest/user-manual/connecting/connecting-tor/tor-os/tor-ios">instructions</a></li>
      <li>Download Element app for iOS</li>
      <li>In the Element app, you will be asked to "Select a Server."  Choose "Other," and enter <code>http://your_synapse_address_from_interfaces.onion</code></li>
      <li>Complete sign in or account creation.  If you are asked to 'Trust' a certificate, go ahead and do so.  This is safe to do as you are the server operator and traffic is already over Tor</li>
    </ol>
  </li>
</ul>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 4: Enable Cross Signing</h3>
<ol>
  <li>Go to Settings --> Security & Privacy --> Cross-signing</li>
  <li>If you see a green checkmark with <code>Cross-signing is ready for use</code>, then you are good to go</li>
  <li>If you see <code>Cross-signing has not been set up</code>, then click <code>Set Up</code>, then follow the
    instructions to complete setup</li>
  <li>Alternatively, if you see <code>Cross-signing is ready but keys are not backed up</code>, follow the backup instructions in Step 4</li>
</ol>
<p>Explanation: The Matrix protocol uses advanced cryptography to ensure that you are, in fact, communicating with the
  people you think you are,
  and not impostors. To make this as simple as possible, Matrix offers something called Cross Signing, which allows
  users to verify each other, and then for each user to verify their own various devices. The alternative is that
  every user would need to verify every
  device of everyone they interact with, which is simply annoying. You can read more about Cross Signing 
  <a href="https://element.io/blog/e2e-encryption-by-default-cross-signing-is-here/" target="_blank">here</a>.
</p>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 5: Joining a Remote Room</h3>
<ol>
  <li>On the main dashboard, select <code>Explore Public Rooms</code>.</li>
  <li>In the search field, paste in the alias of the room you want to join. Room aliases start with #. For example, if you want to join a room on a friend's server, you would need their .onion address and the room name. It would look something like this: <code>#room-name:yxtgpdjhafirrf3jskstue3bcs5wrrj47u4ljbmcgrubq46uxwpz7fad.onion</code>. Then click <code>&#8626; Join</code>.</li>
  <li>Joining a room can take a while, depending on how many users are currently in the room. If it fails, simply try again.</li>
  <li>Please note that to join a room on a remote server over federation, you need to know the .onion address of that server. This is like sharing secrets between each other, but the secret is one party's V3 .onion homeserver address with the room name.</li>
</ol>

<br />
<hr style="border: 1px dashed #bbb;" />
<br />

<h3>Step 6: Creating Backups - <span style="color: red;">Important, Read Carefully!</span></h3>
<p><u>Encryption Keys</u>: Matrix uses end-to-end (E2E) encryption, meaning all encryption/decryption is performed
  locally on your phone/computer using keys stored on the device. To further complicate things, these keys are
  frequently changed to ensure maximum security. And to even further complicate things, when you log out of
  Element, these keys are purged from memory. Meaning, if you log out of all your Element client apps, you will
  lose your keys and be unable to decrypt your own message history!</p>
<p><u>Message History</u>: Additionally, your entire (encrypted) message history is stored on your personal
  Synapse server, which is running on your physical Start9 server. So there are two, separate types of backups
  that are needed: (1) the encryption keys on your device and (2) the message history on your Start9 server.</p>
<ul>
  <li>
    <h4>Backing up encryption keys</h4>
    <p>There are two methods of backing up encryption keys: Manual and Automatic</p>
    <ul>
      <li>
        <h5>Manual</h5>
        <p>Because your encryption keys are rotated frequently, it is almost impossible to perform manual backups
          and guarantee that all messages can be recovered. However, performing periodic backups can at least
          ensure the recovery of messages up until that point in time.</p>
        <ol>
          <li>
            In your Element app, go to Settings --> Security & Privacy --> Cryptography --> "Export
            E2E room keys"
          </li>
          <li>
            Optionally enter a passphrase to protect the backup and save the file somewhere safe
          </li>
          <li>
            Remember, the keys involved in this backup will only be capable of decrypting messages up until the
            time of backup. New messages will likely be unrecoverable
          </li>
        </ol>
      </li>
      <li>
        <h5>Automatic</h5>
        <p>This option will <i>automatically</i> store encrypted backups of your keys on your Start9 server whenever they
          are rotated
          and is the recommended way of doing key backup</p>
        <ol>
          <li>
            In your Element app, go to Settings --> Security & Privacy --> Secure Backup --> "Set up".
          </li>
          <li>
            You will be prompted to select either <code>Generate a Security Key</code> or
            <code>Enter a Security Phrase</code>.
            This is a misleading choice. Either way, Element will generate a security key.
            If you select <code>Generate a Security Key</code> (recommended), Element will display the Security Key
            for you to store on your own.
            If you select <code>Enter a Security Phrase</code>, Element will encrypt the Security Key with your
            Security Phrase,
            then store it on your Start9 server. In the former case, you will need to keep and protect a private key.
            In the latter case, you will need to keep and protect a chosen passphrase. Either way, you will need to
            store something.
            The reason it is recommended to select <code>Generate a Security Key</code> is because, if someone gets
            access to your Synapse server,
            it is <i>far</i> more likely they will guess your chosen passphrase than be able to brute force a private
            key.
          </li>
          <li>
            Regardless of which option you choose, you must store the value somewhere safe. <b>Do not lose
              it!</b>. It is recommended to store it in your self-hosted Bitwarden.
          </li>
        </ol>
      </li>
    </ul>
  </li>
  <li>
    <h4>Backing up message history</h4>
    <p>All of your (encrypted) messages are securely stored on your dedicated Start9 server. Given the importance of preserving your data, it is crucial to regularly create backups of Synapse on StartOS to ensure its protection and availability.</p>
  </li>
</ul>
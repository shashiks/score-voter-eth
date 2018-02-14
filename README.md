
This is a demo project with samples for :
<ul>
<li>Score based Voting using Ethereum Smart Contracts</li>
</ul>

<p>It uses ReactJS as the frontend framework, bootstrap for layouts, webpack for packaging.<p>
<p>Truffle is used for communicating with ETH and deploying code to blockchain</p>
<p>MetaMask integration for interacting Rinkeby Test Net</p>

Feel free to use this as a template to get started on these technologies.
</br>
<p>It consists of a Voting Contract and a UserRepository interface and its impl.
<p>The interface is defined so that the user repo and the process of registration and validations can be changed in future
as required.
<p>The Voting contract expects an address of any Contract implementing the UserRepository interface to be injected for it
to validate and get details of voters voting for options.

<p>After the deployment of contracts to the blockchain the flow at a high level is as follows:
<ol>
<li>Admin creates a list of Options for the survey.</li>
<li>User needs to provide a metamask user account on (Rinkeby for now or any selected network) to the admin before his user account can be created by Admin
<li>Admin creates a list of users using  name and user account (should be an ETH address)</li> 
<li>User goes to Survey options list. and selects a score for each option. Score to be between 1 and n where 'n' being the number of options available</li>
<li>User can cancel anytime before submitting his survey</li>
<li>User has to use the account provided earlier to admin for voting. Once voted he/she cannot vote again.</li>
<li>Once voting is over. i.e. all users have voted Admin can go and look at results.</li>
</ol>

<p>A known issue for now would be
<p> The Registration process is manual for now. This can be automated later. 

<p>
The <pre>tags.js</pre</pre> file should contain the random key words from your vault that will be used
to connect to Etehreum via Infura. This file is ignored under ,gitignore to keep your person data 
offline. <b>Make sure you never commit these keywords to your repo</b>


Bootstrap theme template is from https://startbootstrap.com/template-overviews/sb-admin/
This project was created using create-react-app https://github.com/facebookincubator/create-react-app

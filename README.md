
This is a demo project with samples for :
<ul>
<li>Score based Voting using Ethereum Smart Contracts</li>
</ul>

<p>It uses ReactJS as the frontend framework, bootstrap for layouts, webpack for packaging.<p>
<p>Truffle is used for communicating with ETH and deploying code to blockchain</p>

Feel free to use this as a template to get started on these technologies.
</br>
<p>It consists of a Voting Contract and a UserRepository interface and its impl.
<p>The interface is defined so that the user repo and the process of registration and validations can be changed in future
as required.
<p>The Voting contract expects an address of any Contract implementing the UserRepository interface to be injected for it
to validate and get details of voters voting for options.

<p>After the deployment of contracts to the blockchain the flow at a high level is as follows:
<ol>
<li>Admin creates a list of Options for the survey</li>
<li>Admin also creates a list of users using just the names.</li>
<li>User registers by selecting his name and generates a wallet for himself. This will require a password too. (not providing update of password for now),</li>
<li>User goes to Survey options list. and selects a score for each option. Score to be between 1 and n where 'n' being the number of options available</li>
<li>User can cancel anytime before submitting his survey</li>
<li>Submitting the survey needs the password used while creating wallet. Once submitted he/she cannot vote again.</li>
<li>Once survey is over. i.e. all users have voted Admin can go and look at results.</li>
</ol>

<p>A known issue for now would be
<p> In Step 3 - user can select invalid name (someone else's name) - but this is for internal use only for now, so I am not adding complexity there.




Bootstrap theme template is from https://startbootstrap.com/template-overviews/sb-admin/
This project was created using create-react-app https://github.com/facebookincubator/create-react-app

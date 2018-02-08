export function   watchEvents (contract, contractId, callback) {

      //console.log(" from watcher   " + bidAuction + " " + itemId + " " + callback);

      var startVote = contract.StartVote({fromBlock: 'latest', toBlock: 'latest', address : contractId});
          startVote.watch(function(error, result){
              if(!error) {
                callback("Voting Started by Account Id : " + result.args.voter, false, true);
              } else {
                callback("Err in StartVote event "+ error, true, true);
              }
          });

        var endVote = contract.EndVote({fromBlock: 'latest', toBlock: 'latest', address : contractId});
          endVote.watch(function(error, result){
              if(!error) {
                callback("Vote submitted by : " + result.args.voter, false, true);
              } else {
                callback("Err in EndVote event "+ error, true, true);
              }
          });

        var cancelVote = contract.CancelVote({fromBlock: 'latest', toBlock: 'latest', address : contractId});
          cancelVote.watch(function(error, result){
              if(!error) {
                callback(" Voting cancelled by : " + result.args.voter, false, true);
              }
              else {
                callback("Err in CancelVote event "+ error, true, true);
              }
          });

          var doubleVoting = contract.DoubleVoting({fromBlock: 'latest', toBlock: 'latest', address : contractId});
          doubleVoting.watch(function(error, result){
              if(!error) {
                callback("Double voting! User has already voted : " + result.args.voter, true, true);
              } else {
                callback("Err in DoubleVoting event "+ error, true, true);
              }
          });


    var inProcess = contract.InProcess({fromBlock: 'latest', toBlock: 'latest', address : contractId});
          inProcess.watch(function(error, result){
              if(!error) {
                callback("User voting already under process : " + result.args.voter, false, true);
              } else {
                callback("Err in InProcess event "+ error, true, true);
              }
          });

        var invalidUserId = contract.InvalidUserId({fromBlock: 'latest', toBlock: 'latest', address : contractId});
          invalidUserId.watch(function(error, result){
              if(!error) {
                callback("Invalid user id : " + result.args.userId + " Id not registered for voting", true, true);
              } else {
                callback("Err in InvalidUserId event "+ error, true, true);
              }
          });

        var walletUpdateSuccess = contract.WalletUpdateSuccess({fromBlock: 'latest', toBlock: 'latest', address : contractId});
          walletUpdateSuccess.watch(function(error, result){
              if(!error) {
                callback( " Account updated successfully with  account Id : " + result.args.walletaddr, false, true);
              }
              else {
                callback("Err in walletUpdateSuccess event "+ error, true, true);
              }
          });

          var incomleteVoting = contract.IncomleteVoting({fromBlock: 'latest', toBlock: 'latest', address : contractId});
          incomleteVoting.watch(function(error, result){
              if(!error) {
                callback("Incomplete voting for user Id : " + result.args.voter , true, true);
              } else {
                callback("Err in IncomleteVoting event "+ error, true, true);
              }
          });

}


export default {watchEvents}
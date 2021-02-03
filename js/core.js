function copy() {
    textRange = document.extractor.output.createTextRange();
    textRange.execCommand("RemoveFormat");
    textRange.execCommand("Copy");
}

function paste() {
    textRange = document.extractor.input.createTextRange();
    textRange.execCommand("RemoveFormat");
    textRange.execCommand("Paste");
}

function copymails() {
    var output1 = document.getElementById("output").value;
    if (output1.length < 1) {
        $('#copydone').html('No mails to copy');
    } else {
        $('#output').select();
        document.execCommand('copy');
        $('#copydone').html('The addresses have been copied to clipboard');
    }
}

function ChangedAddressType() {
    $('#ForMail').toggle();
}

function help() {

    var imgwid = 450;
    var imghgt = 360;

    content = ('<html><head><title>Email Extractor : Help</title>');
    content += ('<style type="text/css">');
    content += ('body,td,th,ul,p       { font: normal normal normal 8pt/1em Verdana; color: #000; }');
    content += ('</style>');
    content += ('</head><body onload="window.focus();">');
    content += ('<strong>Quick and dirty</strong>');
    content += ('<ol>');
    content += ('<li>Copy all text from any webpages, documents, files, etc...</li>');
    content += ('<li>Paste it into <strong>Input Window</strong>.</li>');
    content += ('<li>Click "<em>Extract</em>" button.</li>');
    content += ('<li>Copy the result from <strong>Output Window</strong> to somewhere and save it.</li>');
    content += ('<li>Click "<em>Reset</em>" button to start all over again.</li>');
    content += ('</ol>');
    content += ('<br /><br /><strong>More Controls</strong>');
    content += ('<ol>');
    content += ('<li>Click "<em>Paste Input</em>" link to paste any text you copied elsewhere into <strong>Input Window</strong>.</li>');
    content += ('<li>Click "<em>Copy Output</em>" link to copy whatever text inside <strong>Output Window</strong>.</li>');
    content += ('<li>Choose different separator from the dropdown menu or specify your own. Default is comma.</li>');
    content += ('<li>You can group a number of emails together. Each group is separated by a new line. Please enter number only.</li>');
    content += ('<li>Check "<em>Sort Alphabetically</em>" checkbox to arrange extracted emails well... alphabetically.</li>');
    content += ('<li>You can extract or exclude emails containing certain string (text). Useful if you only want to get email from a particular domain.</li>');
    content += ('<li>You can choose to extract web addresses instead of email addresses.</li>');
    content += ('</ol>');
    content += ('<div align="center"><input type="button" value="Close" onClick="javascript:window.close();" /></div>');
    content += ('</body></html>');

    var winl = (screen.width - imgwid) / 2;
    var wint = (screen.height - imghgt) / 2;
    helpwindow = window.open('', 'help', 'width=' + imgwid + ',height=' + imghgt + ',resizable=0,scrollbars=0,top=' + wint + ',left=' + winl + ',toolbar=0,location=0,directories=0,status=0,menubar=0,copyhistory=0');
    helpwindow.document.write(content);
    helpwindow.document.close();
}

function checksep(value) {
    if (value) document.extractor.sep.value = "other";
}

function numonly(value) {
    if (isNaN(value)) {
        window.alert("Please enter a number or else \nleave blank for no grouping.");
        document.extractor.groupby.focus();
    }
}

function findEmail() {
    var email = "none";
    var a = 0;
    var ingroup = 0;
    var separator = document.extractor.sep.value;
    var string = document.extractor.string.value;
    var groupby = Math.round(document.extractor.groupby.value);
    var address_type = document.extractor.address_type.value;
    var input = document.extractor.input.value;

    if (document.extractor.lowcase.checked) {
        var input = input.toLowerCase();
    }

    if (separator == "new") separator = "\n";
    if (separator == "other") separator = document.extractor.othersep.value;

    if (address_type == "web") {
        rawemail = input.match(/([A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_%&\?\/.=]+)/gi);
    } else {
		if (document.extractor.RemoveNumeric.checked) {
        rawemail = input.match(/([a-zA-Z0-9._-]+@[a-zA-Z._-]+\.[a-zA-Z0-9._-]+)/gi);
		}else{
		rawemail = input.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);	
		}
        /////console.log(rawemail);
    }

    var norepeat = new Array();
    var filtermail = new Array();
    if (rawemail) {
        if (string) {
            x = 0;
            for (var y = 0; y < rawemail.length; y++) {
                if (document.extractor.filter_type.value == 1) {
                    if (rawemail[y].search(string) >= 0) {
                        filtermail[x] = rawemail[y];
                        x++;
                    }
                } else {
                    if (rawemail[y].search(string) < 0) {
                        filtermail[x] = rawemail[y];
                        x++;
                    }
                }
            }
            rawemail = filtermail;
        }

        for (var i = 0; i < rawemail.length; i++) {
            var repeat = 0;

            ///// Check for repeated emails routine

            for (var j = i + 1; j < rawemail.length; j++) {
                if (rawemail[i] == rawemail[j]) {
                    repeat++;
                }
            }



            ///// Create new array for non-repeated emails

            if (repeat == 0) {

                ///// Remove any last .dot that skiped on regrex

                var lastchar = rawemail[i].slice(-1);
                if (lastchar == '.') {
                    norepeat[a] = rawemail[i].substring(0, rawemail[i].length - 1);

                } else {
                    norepeat[a] = rawemail[i];
                }

                a++;
            }


        }

        if (document.extractor.UseKeyword.checked) {
            for (var i = 0; i < norepeat.length; i++) {

                var RemoveKeywords = document.extractor.RemoveKeywords.value;
                RemoveKeywords = RemoveKeywords.replace(/ /g, ''); ///// Remove any space
                RemoveKeywords = RemoveKeywords.split(',');
                var searchMail = norepeat[i];

                $.each(RemoveKeywords, function (key, value) {

                    if (searchMail.indexOf(value) > -1) {
                        //console.log('Found: ' + value + ' on => ' + searchMail);
                        delete norepeat[i];
                        return false;
                    }

                });


            }

            ///// Remove empty elements from array

            norepeat = $.grep(norepeat, function (n) {
                return n == 0 || n
            });
        }

        if (document.extractor.sort.checked) norepeat = norepeat.sort(); // Sort the array


        email = "";

        ///// Join emails together with separator

        for (var k = 0; k < norepeat.length; k++) {
            if (ingroup != 0) email += separator;
            email += norepeat[k];
            ingroup++;

            ///// Group emails if a number is specified in form. Each group will be separate by new line.
            if (groupby) {
                if (ingroup == groupby) {
                    email += '\n\n';
                    ingroup = 0;
                }
            }
        }
    }

    ///// Return array length
    var count = norepeat.length;

    ///// Print results
    document.extractor.count.value = count;
    document.extractor.output.value = email;
}
/////  End -->

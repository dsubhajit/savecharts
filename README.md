saveCharts: Save Chart Plugin for Flot Charts
=============================================
Written by Subhajit Dey.

[flot-savecharts](https://github.com/dsubhajit/savecharts) provides
flot with the ability to save charts in png format.  It supports only line and bar charts.
In next version it may support pie chart.

Example
-------

    $(function () {
        var options = {
            saveChart:{
				show:true
			}
        };

        $.plot($("#placeholder"),
               yourData,
               options);
        );
    });

Demo:
------
   Link1: http://dsubhajit.net76.net/flot/examples/basic-usage/index.html
   Link2: http://dsubhajit.net76.net/flot/examples/categories/index.html
   Link3: http://dsubhajit.net76.net/flot/examples/series-types/index.html

Compatibility
-------------

Not sure about that. It is a beta version. Please inform if any support issue found.


License
-------

flot-savechart is released under the terms of [the MIT License](http://www.opensource.org/licenses/MIT).




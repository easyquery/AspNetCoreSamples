import { Component, AfterViewInit} from '@angular/core';

import { EqContext } from '@easyquery/core';
import { EqViewOptions, AdvancedSearchView } from '@easyquery/ui';

import '@easyquery/enterprise'

@Component({
    selector: 'easyquery',
    templateUrl: './easyquery.component.html'
})

export class EasyQueryComponent implements AfterViewInit {

    private QUERY_KEY = 'easyquerycomponent-query';

    private context: EqContext;

    private view: AdvancedSearchView;

    constructor() {
      
    }
   

    ngAfterViewInit() {

      const options: EqViewOptions = {
        enableExport: true,
        loadModelOnStart: true,
        loadQueryOnStart: false,

        handlers: {
          onError: (error) => {
            console.error(error.action + " error:\n" + error.text);
          },
          listRequestHandler: (params, onResult) => {
            let processed = true;
            if (params.listName == "RegionList") {
                let query = this.context.getQuery();
                let country = query.getOneValueForAttr("Customer.Country");
                if (country == "Canada") {
                    onResult([
                        { id: "BC", text: "British Columbia" },
                        { id: "Quebec", text: "Quebec" }
                    ]);
                }
                else {
                    onResult([
                        { id: "CA", text: "California" },
                        { id: "CO", text: "Colorado" },
                        { id: "OR", text: "Oregon" },
                        { id: "WA", text: "Washington" }
                    ]);
                }
            }
            else
                processed = false;
            return processed;
          }
        },
        widgets: {
          entitiesPanel: {
            showCheckboxes: true
          },
          columnsPanel: {
            allowAggrColumns: true,
            allowCustomExpressions: true,
            attrElementFormat: "{entity} {attr}",
            titleElementFormat: "{attr}",
            showColumnCaptions: true,
            adjustEntitiesMenuHeight: false,
            customExpressionText: 2,
            showPoweredBy: false,
            menuOptions: {
                showSearchBoxAfter: 30,
                activateOnMouseOver: true
            }
          },
          queryPanel: {
            showPoweredBy: false,
            alwaysShowButtonsInPredicates: false,
            allowParameterization: true,
            allowInJoinConditions: true,
            autoEditNewCondition: true,
            buttons: {
                condition: ["menu"],
                predicate: ["addCondition", "addPredicate", "enable", "delete"]
            },
            menuOptions: {
                showSearchBoxAfter: 20,
                activateOnMouseOver: true
            }
          }
        },
        result: {
          showChart: true
        }
      }

      this.view = new AdvancedSearchView();
      this.context = this.view.getContext();

      this.context.useEnterprise("AlzWbvUgrkISH9AEAEoV7wBKJXGX14");

      this.context.addEventListener('ready', () => {
        const query = this.context.getQuery();

        query.addChangedCallback(() => {
          const queryJson = query.toJSON();
          localStorage.setItem(this.QUERY_KEY, queryJson);
          console.log("Query saved", query);
        });

        //add load query from local storage
        this.loadQueryFromLocalStorage();
      });

      this.view.init(options);
     }  

    private loadQueryFromLocalStorage() {
        const queryJson = localStorage.getItem(this.QUERY_KEY);
        if (queryJson) {
          const query = this.context.getQuery();
          query.loadFromDataOrJson(queryJson);
          query.fireChangedEvent();
          
          setTimeout(() => this.view.executeQuery(), 100);
        }
    };

    
}

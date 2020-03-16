## Creating a `page`

2.  Add the `containers` and `components` to the page.

    1.  You might want to add a full page UI test to make sure the UI looks as you would expect.

    2.  For behavior, when a service sends you something. E.g. a router passes a query param, and that query param triggers another code path. You should mock the router, and test the code path that is executed if the router was to return the expected output. Or fallback gracefully if the router does something unexpected.

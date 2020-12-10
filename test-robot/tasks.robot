# ## Google Image Search Example
# This simple robot will execute a Google Image Search and save the first result image.
#
# In Robocorp Lab, click on the `>>` button above to run the whole example, or you can execute each cell by using the `>` button.

*** Settings ***
Documentation     Executes Google image search and stores the first result image.
Library           RPA.Browser

*** Variables ***
${GOOGLE_URL}     https://google.com/?hl=en
${SEARCH_TERM}    cute dog picture

*** Keywords ***
Accept Google Consent
    Select Frame    //iframe[contains(@src, "https://consent.google.com")]
    Click Element    id:introAgreeButton

*** Keywords ***
Open Google search page
    Open Available Browser    ${GOOGLE_URL}
    Run Keyword And Ignore Error    Accept Google Consent

*** Keywords ***
Search for
    [Arguments]    ${text}
    Input Text    name:q    ${text}
    Press Keys    name:q    ENTER
    Wait Until Page Contains    results

*** Keywords ***
View image search results
    Click Link    Images

*** Keywords ***
Screenshot first result
    Capture Element Screenshot    css:div[data-ri="0"]

*** Tasks ***
Execute Google image search and store the first result image
    Open Google search page
    Search for    ${SEARCH_TERM}
    View image search results
    Screenshot first result
    [Teardown]    Close Browser

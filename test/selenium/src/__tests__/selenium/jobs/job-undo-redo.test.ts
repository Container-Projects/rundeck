import {Context} from '@rundeck/testdeck/context'
import {CreateContext} from '@rundeck/testdeck/test/selenium'
import {ProjectCreatePage} from 'pages/projectCreate.page'
import {LoginPage} from 'pages/login.page'
import {JobCreatePage} from 'pages/jobCreate.page'
import {JobShowPage} from "pages/jobShow.page"
import {until, By, Key} from 'selenium-webdriver'
import '@rundeck/testdeck/test/rundeck'

// We will initialize and cleanup in the before/after methods
let ctx = CreateContext({projects: ['SeleniumBasic']})
let loginPage: LoginPage
let jobCreatePage: JobCreatePage

beforeAll( async () => {
    loginPage = new LoginPage(ctx)
    jobCreatePage = new JobCreatePage(ctx, 'SeleniumBasic')
})

beforeAll(async () => {
    await loginPage.login('admin', 'admin')
})

describe('job', () => {
    it('job option simple redo', async () => {
        await jobCreatePage.get()
        await ctx.driver.wait(until.urlContains('/job/create'), 25000)
        let jobNameText='a job with options undo-redo test'
        let jobName=await jobCreatePage.jobNameInput()
        await jobName.sendKeys(jobNameText)

        //add workflow step
        let wfTab=await jobCreatePage.tabWorkflow()
        await wfTab.click()
        let addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        let wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test')

        let wfStep0SaveButton=await jobCreatePage.wfStep0SaveButton()

        //click step Save button and wait for the step content to display
        await wfStep0SaveButton.click()
        await jobCreatePage.waitWfstep0vis()

        //add options//
        //1. click new option button
        let optionNewButton = await jobCreatePage.optionNewButton()
        await optionNewButton.click()
        //2. wait for edit form to load
        await jobCreatePage.waitoptionEditForm("0")

        let optionName='seleniumOption1'
        let optionNameInput=await jobCreatePage.optionNameInput("0")
        await optionNameInput.sendKeys(optionName)

        //save option
        let optionFormSaveButton = await jobCreatePage.optionFormSave("0")
        await optionFormSaveButton.click()

        //wait for option to save
        await jobCreatePage.waitOptionli("0")

        // NEW OPTION
        //1. click new option button
        optionNewButton = await jobCreatePage.optionNewButton()
        await optionNewButton.click()
        //2. wait for edit form to load
        await jobCreatePage.waitoptionEditForm("1")

        optionName='seleniumOption2'
        optionNameInput=await jobCreatePage.optionNameInput("1")
        await optionNameInput.sendKeys(optionName)

        //save option
        optionFormSaveButton = await jobCreatePage.optionFormSave("1")
        await optionFormSaveButton.click()

        //wait for option to save
        await jobCreatePage.waitOptionli("1")
        
        let optionUndo = await jobCreatePage.optionUndoButton()
        expect(optionUndo).toBeDefined()

        let optionRedo= await jobCreatePage.optionRedoButton()
        expect(optionRedo).toBeDefined()

        optionUndo.click();
        await jobCreatePage.waitUndoRedo(5000);

        let isOptionli=await jobCreatePage.isOptionli("1")
        expect(isOptionli).toEqual(false)

        //save the job
        let save = await jobCreatePage.saveButton()
        await save.click()

        await ctx.driver.wait(until.urlContains('/job/show'), 15000)
        let jobShowPage = new JobShowPage(ctx,'SeleniumBasic','')

        //verify job name

        let jobTitleText = await jobShowPage.jobTitleText()
        expect(jobTitleText).toContain(jobNameText)

    })


    it('job option revert all', async () => {
        await jobCreatePage.get()
        await ctx.driver.wait(until.urlContains('/job/create'), 25000)
        let jobNameText='a job with options revert all test'
        let jobName=await jobCreatePage.jobNameInput()
        await jobName.sendKeys(jobNameText)

        //add workflow step
        let wfTab=await jobCreatePage.tabWorkflow()
        await wfTab.click()
        let addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        let wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test')

        let wfStep0SaveButton=await jobCreatePage.wfStep0SaveButton()

        //click step Save button and wait for the step content to display
        await wfStep0SaveButton.click()
        await jobCreatePage.waitWfstep0vis()

        //add options//
        //1. click new option button
        let optionNewButton = await jobCreatePage.optionNewButton()
        await optionNewButton.click()
        //2. wait for edit form to load
        await jobCreatePage.waitoptionEditForm("0")

        let optionName='seleniumOption1'
        let optionNameInput=await jobCreatePage.optionNameInput("0")
        await optionNameInput.sendKeys(optionName)

        //save option
        let optionFormSaveButton = await jobCreatePage.optionFormSave("0")
        await optionFormSaveButton.click()

        //wait for option to save
        await jobCreatePage.waitOptionli("0")

        // NEW OPTION
        //1. click new option button
        optionNewButton = await jobCreatePage.optionNewButton()
        await optionNewButton.click()
        //2. wait for edit form to load
        await jobCreatePage.waitoptionEditForm("1")

        optionName='seleniumOption2'
        optionNameInput=await jobCreatePage.optionNameInput("1")
        await optionNameInput.sendKeys(optionName)

        //save option
        optionFormSaveButton = await jobCreatePage.optionFormSave("1")
        await optionFormSaveButton.click()

        //wait for option to save
        await jobCreatePage.waitOptionli("1")
        
        let optionUndo = await jobCreatePage.optionUndoButton()
        expect(optionUndo).toBeDefined()

        let revertOptionButton= await jobCreatePage.revertOptionsButton()
        expect(revertOptionButton).toBeDefined()

        revertOptionButton.click();
        await jobCreatePage.waitUndoRedo(5000);

        let revertOptionsConfirm= await jobCreatePage.revertOptionsConfirm()
        expect(revertOptionsConfirm).toBeDefined()

        revertOptionsConfirm.click()

        await jobCreatePage.waitUndoRedo(5000);

        let isOptionli0=await jobCreatePage.isOptionli("0")
        expect(isOptionli0).toEqual(false)
        let isOptionli1=await jobCreatePage.isOptionli("1")
        expect(isOptionli1).toEqual(false)

        //save the job
        let save = await jobCreatePage.saveButton()
        await save.click()

        await ctx.driver.wait(until.urlContains('/job/show'), 15000)
        let jobShowPage = new JobShowPage(ctx,'SeleniumBasic','')

        //verify job name

        let jobTitleText = await jobShowPage.jobTitleText()
        expect(jobTitleText).toContain(jobNameText)

    })

    it('job option undo redo', async () => {
        await jobCreatePage.get()
        await ctx.driver.wait(until.urlContains('/job/create'), 25000)
        let jobNameText='a job with options undo redo test'
        let jobName=await jobCreatePage.jobNameInput()
        await jobName.sendKeys(jobNameText)

        //add workflow step
        let wfTab=await jobCreatePage.tabWorkflow()
        await wfTab.click()
        let addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        let wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test')

        let wfStep0SaveButton=await jobCreatePage.wfStep0SaveButton()

        //click step Save button and wait for the step content to display
        await wfStep0SaveButton.click()
        await jobCreatePage.waitWfstep0vis()

        //add options//
        //1. click new option button
        let optionNewButton = await jobCreatePage.optionNewButton()
        await optionNewButton.click()
        //2. wait for edit form to load
        await jobCreatePage.waitoptionEditForm("0")

        let optionName='seleniumOption1'
        let optionNameInput=await jobCreatePage.optionNameInput("0")
        await optionNameInput.sendKeys(optionName)

        //save option
        let optionFormSaveButton = await jobCreatePage.optionFormSave("0")
        await optionFormSaveButton.click()

        //wait for option to save
        await jobCreatePage.waitOptionli("0")

        // NEW OPTION
        //1. click new option button
        optionNewButton = await jobCreatePage.optionNewButton()
        await optionNewButton.click()
        //2. wait for edit form to load
        await jobCreatePage.waitoptionEditForm("1")

        optionName='seleniumOption2'
        optionNameInput=await jobCreatePage.optionNameInput("1")
        await optionNameInput.sendKeys(optionName)

        //save option
        optionFormSaveButton = await jobCreatePage.optionFormSave("1")
        await optionFormSaveButton.click()

        //wait for option to save
        await jobCreatePage.waitOptionli("1")
        
        let optionUndo = await jobCreatePage.optionUndoButton()
        expect(optionUndo).toBeDefined()

        optionUndo.click()
        await jobCreatePage.waitUndoRedo(5000);

        let optionRedo = await jobCreatePage.optionRedoButton()
        expect(optionRedo).toBeDefined()

        optionRedo.click()
        await jobCreatePage.waitUndoRedo(5000);

        let isOptionli0=await jobCreatePage.isOptionli("0")
        expect(isOptionli0).toEqual(true)
        let isOptionli1=await jobCreatePage.isOptionli("1")
        expect(isOptionli1).toEqual(true)

        //save the job
        let save = await jobCreatePage.saveButton()
        await save.click()

        await ctx.driver.wait(until.urlContains('/job/show'), 15000)
        let jobShowPage = new JobShowPage(ctx,'SeleniumBasic','')

        //verify job name

        let jobTitleText = await jobShowPage.jobTitleText()
        expect(jobTitleText).toContain(jobNameText)

    })

    it('job workflow simple undo', async () => {
        await jobCreatePage.get()
        await ctx.driver.wait(until.urlContains('/job/create'), 25000)
        let jobNameText='a job with workflow undo test'
        let jobName=await jobCreatePage.jobNameInput()
        await jobName.sendKeys(jobNameText)

        //add workflow step
        let wfTab=await jobCreatePage.tabWorkflow()
        await wfTab.click()
        let addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        let wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test')

        let wfStep0SaveButton=await jobCreatePage.wfStepSaveButton('0')

        //click step Save button and wait for the step content to display
        await wfStep0SaveButton.click()
        await jobCreatePage.waitWfstepvis('0')

        // add step 2
        let addNewWfStepButton = await jobCreatePage.addNewWfStepButton()
        expect(addNewWfStepButton).toBeDefined()

        addNewWfStepButton.click()

        addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test 2')

        let wfStep1SaveButton=await jobCreatePage.wfStepSaveButton('1')

        //click step Save button and wait for the step content to display
        await wfStep1SaveButton.click()
        await jobCreatePage.waitWfstepvis('1')


        let wfUndo = await jobCreatePage.wfUndoButton()
        expect(wfUndo).toBeDefined()

        wfUndo.click()
        await jobCreatePage.waitUndoRedo(5000)

        let isWfli1=await jobCreatePage.isWfli("1")
        expect(isWfli1).toEqual(false)

        //save the job
        let save = await jobCreatePage.saveButton()
        await save.click()

        await ctx.driver.wait(until.urlContains('/job/show'), 15000)
        let jobShowPage = new JobShowPage(ctx,'SeleniumBasic','')

        //verify job name

        let jobTitleText = await jobShowPage.jobTitleText()
        expect(jobTitleText).toContain(jobNameText)

    })

    it('job workflow undo redo', async () => {
        await jobCreatePage.get()
        await ctx.driver.wait(until.urlContains('/job/create'), 25000)
        let jobNameText='a job with workflow undo-redo test'
        let jobName=await jobCreatePage.jobNameInput()
        await jobName.sendKeys(jobNameText)

        //add workflow step
        let wfTab=await jobCreatePage.tabWorkflow()
        await wfTab.click()
        let addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        let wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test')

        let wfStep0SaveButton=await jobCreatePage.wfStepSaveButton('0')

        //click step Save button and wait for the step content to display
        await wfStep0SaveButton.click()
        await jobCreatePage.waitWfstepvis('0')

        // add step 2
        let addNewWfStepButton = await jobCreatePage.addNewWfStepButton()
        expect(addNewWfStepButton).toBeDefined()

        addNewWfStepButton.click()

        addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test 2')

        let wfStep1SaveButton=await jobCreatePage.wfStepSaveButton('1')

        //click step Save button and wait for the step content to display
        await wfStep1SaveButton.click()
        await jobCreatePage.waitWfstepvis('1')


        let wfUndo = await jobCreatePage.wfUndoButton()
        expect(wfUndo).toBeDefined()

        wfUndo.click()
        await jobCreatePage.waitUndoRedo(5000)

        let wfRedo = await jobCreatePage.wfRedoButton()
        expect(wfRedo).toBeDefined()

        wfRedo.click()
        await jobCreatePage.waitUndoRedo(5000)

        let isWfli1=await jobCreatePage.isWfli("1")
        expect(isWfli1).toEqual(true)

        //save the job
        let save = await jobCreatePage.saveButton()
        await save.click()

        await ctx.driver.wait(until.urlContains('/job/show'), 15000)
        let jobShowPage = new JobShowPage(ctx,'SeleniumBasic','')

        //verify job name

        let jobTitleText = await jobShowPage.jobTitleText()
        expect(jobTitleText).toContain(jobNameText)

    })

    it('job workflow revert all', async () => {
        await jobCreatePage.get()
        await ctx.driver.wait(until.urlContains('/job/create'), 25000)
        let jobNameText='a job with workflow revert all test'
        let jobName=await jobCreatePage.jobNameInput()
        await jobName.sendKeys(jobNameText)

        //add workflow step
        let wfTab=await jobCreatePage.tabWorkflow()
        await wfTab.click()
        let addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        let wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test')

        let wfStep0SaveButton=await jobCreatePage.wfStepSaveButton('0')

        //click step Save button and wait for the step content to display
        await wfStep0SaveButton.click()
        await jobCreatePage.waitWfstepvis('0')

        // add step 2
        let addNewWfStepButton = await jobCreatePage.addNewWfStepButton()
        expect(addNewWfStepButton).toBeDefined()

        addNewWfStepButton.click()

        addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test 2')

        let wfStep1SaveButton=await jobCreatePage.wfStepSaveButton('1')

        //click step Save button and wait for the step content to display
        await wfStep1SaveButton.click()
        await jobCreatePage.waitWfstepvis('1')


        let revertWfButton = await jobCreatePage.revertWfButton()
        expect(revertWfButton).toBeDefined()

        revertWfButton.click()
        await jobCreatePage.waitUndoRedo(5000)

        let revertWfConfirm = await jobCreatePage.revertWfConfirm()
        expect(revertWfConfirm).toBeDefined()

        revertWfConfirm.click()
        await jobCreatePage.waitUndoRedo(5000)

        let isWfli0=await jobCreatePage.isWfli("0")
        expect(isWfli0).toEqual(false)
        let isWfli1=await jobCreatePage.isWfli("1")
        expect(isWfli1).toEqual(false)

        //add final step
        // add step 2
        addNewWfStepButton = await jobCreatePage.addNewWfStepButton()
        expect(addNewWfStepButton).toBeDefined()

        addNewWfStepButton.click()

        addWfStepCommand=await jobCreatePage.addNewWfStepCommand()

        //click add Command step, and wait until input fields are loaded
        await addWfStepCommand.click()
        await jobCreatePage.waitWfStepCommandRemoteText()


        wfStepCommandRemoteText=await jobCreatePage.wfStepCommandRemoteText()
        await wfStepCommandRemoteText.sendKeys('echo selenium test final')

        wfStep0SaveButton=await jobCreatePage.wfStepSaveButton('0')

        //click step Save button and wait for the step content to display
        await wfStep0SaveButton.click()
        await jobCreatePage.waitWfstepvis('0')

        //save the job
        let save = await jobCreatePage.saveButton()
        await save.click()

        await ctx.driver.wait(until.urlContains('/job/show'), 15000)
        let jobShowPage = new JobShowPage(ctx,'SeleniumBasic','')

        //verify job name

        let jobTitleText = await jobShowPage.jobTitleText()
        expect(jobTitleText).toContain(jobNameText)

    })

    
})
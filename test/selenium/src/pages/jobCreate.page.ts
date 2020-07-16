import {By, WebElement, WebElementPromise, until} from 'selenium-webdriver'

import {Page} from '@rundeck/testdeck/page'
import { Context } from '@rundeck/testdeck/context';

export const Elems= {
    jobNameInput  : By.css('form input[name="jobName"]'),
    groupPathInput  : By.css('form input[name="groupPath"]'),
    descriptionTextarea  : By.css('form textarea[name="description"]'),
    saveButton  : By.css('#Create'),
    editSaveButton: By.css('#editForm div.card-footer input.btn.btn-primary[type=submit][value=Save]'),
    errorAlert  : By.css('#error'),
    formValidationAlert: By.css('#page_job_edit > div.list-group-item > div.alert.alert-danger'),

    tabWorkflow  : By.css('#job_edit_tabs > li > a[href=\'#tab_workflow\']'),
    addNewWfStepCommand: By.css('#wfnewtypes #addnodestep > div > a.add_node_step_type[data-node-step-type=command]'),
    wfStepCommandRemoteText: By.css('#adhocRemoteStringField'),
    wfStep0SaveButton: By.css('#wfli_0 div.wfitemEditForm div._wfiedit > div.floatr > span.btn.btn-primary.btn-sm'),
    wfstep0vis: By.css('#wfivis_0'),
    optionNewButton: By.css('#optnewbutton > span'),
    option0EditForm: By.css('#optvis_0 > div.optEditForm'),
    option0NameInput: By.css('#optvis_0 > div.optEditForm input[type=text][name=name]'),
    optionFormSaveButton: By.css('#optvis_0 > div.optEditForm  div.floatr > span.btn.btn-primary.btn-sm'),
    option0li: By.css('#optli_0'),
    notificationsTab: By.css("#job_edit_tabs > li > a[href=\'#tab_notifications\']"),
    enableNotifications: By.css('#notifiedTrue'),
    notifyOnsuccessEmail: By.css('#notifyOnsuccessEmail'),
    notifySuccessRecipients: By.css('#notifySuccessRecipients'),
    tabNodes  : By.css('#job_edit_tabs > li > a[href=\'#tab_nodes\']'),
    doNodedispatchTrue  : By.xpath('//*[@id="doNodedispatchTrue"]'),
    nodeFilter  : By.xpath('//*[@id="schedJobNodeFilter"]'),
    nodeFilterButton  : By.xpath('//*[@id="nodegroupitem"]/div[3]/div/div/span/div[1]/button'),
    nodeFilterSelectAllLink  : By.xpath('//*[@id="nodegroupitem"]/div[3]/div/div/span/div[1]/ul/li[1]/a'),
    matchedNodesText  : By.xpath('//*[@id="nodegroupitem"]/div[6]/div/div[1]/div/div/div[1]/div[1]/span[1]/span')
    

 }
 

export class JobCreatePage extends Page {
    path = '/resources/createProject'
    projectName=''

    constructor(readonly ctx: Context, readonly project: string) {
        super(ctx)
        this.projectName=project
        this.path = `/project/${project}/job/create`
    }
    editPagePath(jobId: string){
        return `/project/${this.projectName}/job/edit/${jobId}`
    }
    async getEditPage(jobId: string) {
        const {driver} = this.ctx
        await driver.get(this.ctx.urlFor(this.editPagePath(jobId)))
    }

    async jobNameInput(){
        return await this.ctx.driver.findElement(Elems.jobNameInput)
    }
    async groupPathInput(){
        return await this.ctx.driver.findElement(Elems.groupPathInput)
    }
    async descriptionTextarea(){
        return await this.ctx.driver.findElement(Elems.descriptionTextarea)
    }
    saveButton():WebElementPromise{
        return this.ctx.driver.findElement(Elems.saveButton)
    }
    async editSaveButton(){
        return this.ctx.driver.findElement(Elems.editSaveButton)
    }
    errorAlert():WebElementPromise{
        return this.ctx.driver.findElement(Elems.errorAlert)
    }
    async tabWorkflow(){
        return await this.ctx.driver.findElement(Elems.tabWorkflow)
    }
    async addNewWfStepCommand(){
        return await this.ctx.driver.findElement(Elems.addNewWfStepCommand)
    }
    async waitWfStepCommandRemoteText(){
        await this.ctx.driver.wait(until.elementLocated(Elems.wfStepCommandRemoteText), 15000)
    }
    async wfStepCommandRemoteText(){
        return await this.ctx.driver.findElement(Elems.wfStepCommandRemoteText)
    }
    async wfStep0SaveButton(){
        return await this.ctx.driver.findElement(Elems.wfStep0SaveButton)
    }
    async wfstep0vis(){
        return await this.ctx.driver.findElement(Elems.wfstep0vis)
    }
    async waitWfstep0vis(){
        await this.ctx.driver.wait(until.elementLocated(Elems.wfstep0vis), 15000)
    }
    async optionNewButton(){
        return await this.ctx.driver.findElement(Elems.optionNewButton)
    }
    async waitoption0EditForm(){
        return this.ctx.driver.wait(until.elementLocated(Elems.option0EditForm),15000)
    }
    async option0NameInput(){
        return await this.ctx.driver.findElement(Elems.option0NameInput)
    }
    async optionFormSaveButton(){
        return await this.ctx.driver.findElement(Elems.optionFormSaveButton)
    }
    async waitOption0li(){
        return this.ctx.driver.wait(until.elementLocated(Elems.option0li),15000)
    }

    async enableNotificationInput(){
        return this.ctx.driver.wait(until.elementLocated(Elems.enableNotifications),15000)
    }

    async notifyOnsuccessEmail(){
        return this.ctx.driver.wait(until.elementLocated(Elems.notifyOnsuccessEmail),15000)
    }

    async notifySuccessRecipients(){
        return this.ctx.driver.wait(until.elementLocated(Elems.notifySuccessRecipients),15000)
    }

    async notificationsTab(){
        return await this.ctx.driver.findElement(Elems.notificationsTab)
    }
    async tabNodes(){
        return await this.ctx.driver.findElement(Elems.tabNodes)
    }
    async dispatchNodes(){
        return this.ctx.driver.wait(until.elementLocated(Elems.doNodedispatchTrue),15000)
    }
    async nodeFilter(){
        return this.ctx.driver.wait(until.elementLocated(Elems.nodeFilter),15000)
    }
    async nodeFilterButton(){
        return this.ctx.driver.wait(until.elementLocated(Elems.nodeFilterButton),15000)
    }
    async nodeFilterSelectAllLink(){
        return this.ctx.driver.wait(until.elementLocated(Elems.nodeFilterSelectAllLink),15000)
    }
    async matchedNodes(){
        return this.ctx.driver.wait(until.elementLocated(Elems.matchedNodesText),15000)
    }
    async matchedNodesText(){
        let matchedNodeElem = await this.matchedNodes()
        return await matchedNodeElem.getText()

    }
    formValidationAlert():WebElementPromise{
        return this.ctx.driver.findElement(Elems.formValidationAlert)
    }

}

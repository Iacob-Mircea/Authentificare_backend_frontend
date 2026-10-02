"use client"

import {useAuth} from "../context/AuthContext"
import AgentWidget from "./AgentWidget"

export default function AgentWrapper({onCalendarChange}){
    const {authenticated,loading } = useAuth();

    if(loading){
        return null;
    }
    if(!authenticated)
        return null;

    return <AgentWidget 
    onCalendarChange={onCalendarChange}/>;

}
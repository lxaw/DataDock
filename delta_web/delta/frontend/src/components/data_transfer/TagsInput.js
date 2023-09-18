/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)
Carter Marlowe (@Cmarlowe132)
Vince Kolb-LugoVince (@vancevince) 
Blake Seekings (@j-blake-s)
Naveen Chithan (@nchithan)

File name:  TagsInput.js

Brief description: 
    When users upload files, they are add their own tags. This file handles
interaction.

###############################################################################
*/

// with help from https://dev.to/0shuvo0/lets_create_an_add_tags_input_with_react_js_d29
import { useEffect, useState } from "react";
import styles from "./tags.module.css";

// src/components/TagsInput.js
function TagsInput(props){
    const [tags, setTags] = useState([])

    // if have prior tags, set them
    useEffect(()=>{
        if(props.priorTags){
            setTags(props.priorTags)
        }
    },[])

    // UTILITY: When the user presses the ENTER key while the TagsInput
    //          is selected, add the current tag to the file. 
    function handleKeyDown(e){
        if(e.key !== 'Enter' || e.which == 32) return
        // remove whitespace - tags can not contain whitespace.
        const value = e.target.value.replace(/\s/g,"");

        // no duplicates
        if(tags.includes(value)) return;
        if(!value.trim()) return;
        setTags([...tags, value])
        e.target.value = ''
        if(props.updateParentTags){
            props.updateParentTags([...tags,value]);
        }
    }

    // UTILITY: When a user chooses to remove an added tag, delete that tag
    //          from the list of tags.
    function removeTag(index){
        const newTags = tags.filter((el, i) => i !== index);
        setTags(newTags)
        if(props.updateParentTags){
            props.updateParentTags(newTags);
        }
    }

    return (
        <div className={styles.tags_input_container} data-testid="tags_input-1">
            { tags.map((tag, index) => (
                <div className={styles.tag_item} key={index}>
                    <span className={styles.text}>{tag}</span>
                    <span className={styles.close} onClick={() => removeTag(index)}>&times;</span>
                </div>
            )) }
            <input  
                onKeyDown={handleKeyDown} 
                type="text" 
                className={styles.tags_input} 
                placeholder="Type something. Note that tags cannot have whitespace."
            />
        </div>
    )
}

export default TagsInput

function NewButton(){
    return(<>
        <button type="button" class="button">
            <span class="fold"></span>

            <span class="inner text-3xl"
                ><p class="font-bold">Note+</p><svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >     
                </svg></span>
         </button>
    </>)
}

export default NewButton;
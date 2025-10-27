import React from 'react'
import HeadSubhead from '../CommonComponents/HeadSubhead'
import { Checkbox, Label, TextInput, Textarea } from "flowbite-react";
import { Link } from 'react-router-dom';

const Registration = () => {
    return (
        <div className='mx-auto mt-20 max-w-7xl'>
            <HeadSubhead title="Registration" subtitle="Create your own profile to take a close look at the exciting products"></HeadSubhead>
            <form className="flex max-w-md flex-col gap-4 mt-5">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="name">Your name</Label>
                    </div>
                    <TextInput id="name" placeholder="Your name" type="text" required shadow />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email2">Your email</Label>
                    </div>
                    <TextInput id="email2" type="email" placeholder="name@example.com" required shadow />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="repeat-password">Your Phone Number</Label>
                    </div>
                    <TextInput id="number" placeholder="Your Phone Number" type="text" required shadow />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password2">Your password</Label>
                    </div>
                    <TextInput id="password2" placeholder="Your password" type="password" required shadow />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="repeat-password">Repeat password</Label>
                    </div>
                    <TextInput id="repeat-password" placeholder="Repeat password" type="password" required shadow />
                </div>
                <div className="max-w-md">
                    <div className="mb-2 block">
                        <Label htmlFor="address">Your Address</Label>
                    </div>
                    <Textarea id="address" placeholder="Write your address..." required rows={4} />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="agree" />
                    <Label htmlFor="agree" className="flex">
                        I agree with the&nbsp;
                        <Link href="#" className="underline">
                            terms and conditions
                        </Link>
                    </Label>
                </div>
                <button className="btn btn-neutral mt-4">Register Your Account</button>
            </form>
        </div>
    )
}

export default Registration